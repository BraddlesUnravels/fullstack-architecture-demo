CREATE USER admin WITH PASSWORD 'password';

CREATE DATABASE app_db OWNER admin;

GRANT ALL PRIVILEGES ON DATABASE app_db TO admin;

-- app_user permissions are granted after tables exist
-- run scripts/db-permissions.sql after migrations