-- Create trigger function to auto-geocode new records
CREATE OR REPLACE FUNCTION public.auto_geocode_record()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  job_payload jsonb;
BEGIN
  -- Only trigger geocoding if coordinates are missing and we have location info
  IF (NEW.latitude IS NULL OR NEW.longitude IS NULL) AND 
     (NEW.city IS NOT NULL OR NEW.state IS NOT NULL) THEN
    
    -- Create background job payload
    job_payload := jsonb_build_object(
      'table_name', TG_TABLE_NAME,
      'record_id', NEW.id,
      'city', NEW.city,
      'state', NEW.state,
      'address', CASE WHEN TG_TABLE_NAME = 'companies' THEN NEW.address ELSE NULL END
    );
    
    -- Insert background geocoding job
    INSERT INTO public.processing_jobs (
      job_type,
      metadata,
      user_id
    ) VALUES (
      'auto_geocode',
      job_payload,
      NULL -- System job
    );
    
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create triggers for all relevant tables
DROP TRIGGER IF EXISTS auto_geocode_companies ON companies;
CREATE TRIGGER auto_geocode_companies
  AFTER INSERT OR UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION auto_geocode_record();

DROP TRIGGER IF EXISTS auto_geocode_providers ON providers;
CREATE TRIGGER auto_geocode_providers
  AFTER INSERT OR UPDATE ON providers
  FOR EACH ROW
  EXECUTE FUNCTION auto_geocode_record();

DROP TRIGGER IF EXISTS auto_geocode_schools ON schools;
CREATE TRIGGER auto_geocode_schools
  AFTER INSERT OR UPDATE ON schools
  FOR EACH ROW
  EXECUTE FUNCTION auto_geocode_record();

DROP TRIGGER IF EXISTS auto_geocode_job_listings ON job_listings;
CREATE TRIGGER auto_geocode_job_listings
  AFTER INSERT OR UPDATE ON job_listings
  FOR EACH ROW
  EXECUTE FUNCTION auto_geocode_record();

-- Create background geocoding processor function
CREATE OR REPLACE FUNCTION public.process_geocoding_jobs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  job_record RECORD;
  coords_result RECORD;
BEGIN
  -- Process up to 10 pending geocoding jobs
  FOR job_record IN 
    SELECT id, metadata 
    FROM processing_jobs 
    WHERE job_type = 'auto_geocode' 
      AND status = 'pending'
    ORDER BY created_at ASC
    LIMIT 10
  LOOP
    -- Mark job as started
    UPDATE processing_jobs 
    SET status = 'processing', started_at = now()
    WHERE id = job_record.id;
    
    -- Call geocoding edge function (this would be called via HTTP in practice)
    -- For now, we'll mark as completed and let the edge function handle it
    UPDATE processing_jobs 
    SET 
      status = 'completed',
      completed_at = now(),
      result_data = jsonb_build_object('message', 'Queued for geocoding')
    WHERE id = job_record.id;
    
  END LOOP;
END;
$function$;