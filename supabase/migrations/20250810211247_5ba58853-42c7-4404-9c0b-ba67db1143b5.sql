-- Remove all DuckDB-related processing jobs from the database
DELETE FROM processing_jobs WHERE job_type = 'npi_duckdb_import';