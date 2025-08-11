-- Remove all remaining NPI-related processing jobs from the database
DELETE FROM processing_jobs WHERE job_type = 'npi_import';