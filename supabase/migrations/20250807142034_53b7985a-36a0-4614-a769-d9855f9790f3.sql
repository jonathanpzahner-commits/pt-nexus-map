-- Check if cron jobs exist and disable NPI background processor
DO $$
BEGIN
  -- Check if cron extension exists and disable NPI processor if it does
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    -- Unschedule any existing NPI background processor jobs
    PERFORM cron.unschedule('npi-background-processor');
    PERFORM cron.unschedule('invoke-npi-background-processor');
    PERFORM cron.unschedule('npi-processor');
    PERFORM cron.unschedule('background-npi-processor');
    
    RAISE NOTICE 'NPI background processor cron jobs have been unscheduled';
  ELSE
    RAISE NOTICE 'pg_cron extension is not enabled, no cron jobs to disable';
  END IF;
END $$;