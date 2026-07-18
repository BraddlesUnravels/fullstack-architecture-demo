DO $$
BEGIN
  EXECUTE format('GRANT ALL PRIVILEGES ON DATABASE %I TO %I', current_database(), current_user);
END $$;

-- app_user permissions are granted after tables exist
-- run scripts/db-permissions.sql after migrations
