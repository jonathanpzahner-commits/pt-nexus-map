-- Fix search path issues for new functions
CREATE OR REPLACE FUNCTION public.auto_geocode_record()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.process_geocoding_jobs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  job_record RECORD;
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
    
    -- Mark as completed (actual geocoding happens via edge function)
    UPDATE processing_jobs 
    SET 
      status = 'completed',
      completed_at = now(),
      result_data = jsonb_build_object('message', 'Queued for geocoding')
    WHERE id = job_record.id;
    
  END LOOP;
END;
$function$;