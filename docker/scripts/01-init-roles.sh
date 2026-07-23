#!/usr/bin/env bash
set -euo pipefail

readonly database_name="${POSTGRES_DB:-app_db}"
readonly migrator_db_user="${MIGRATOR_DB_USER:-db_migrator}"
readonly app_db_user="${APP_DB_USER:-app_user}"

if [[ -z "${MIGRATOR_DB_PASSWORD:-}" ]]; then
  echo "MIGRATOR_DB_PASSWORD is required"
  exit 1
fi

if [[ -z "${APP_DB_PASSWORD:-}" ]]; then
  echo "APP_DB_PASSWORD is required"
  exit 1
fi

psql --username "$POSTGRES_USER" --dbname "$database_name" --set ON_ERROR_STOP=1 \
  --set database_name="$database_name" \
  --set migrator_db_user="$migrator_db_user" \
  --set migrator_db_password="$MIGRATOR_DB_PASSWORD" \
  --set app_db_user="$app_db_user" \
  --set app_db_password="$APP_DB_PASSWORD" <<'SQL'
SELECT format(
  'CREATE ROLE %I LOGIN PASSWORD %L NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS',
  :'migrator_db_user',
  :'migrator_db_password'
)
WHERE NOT EXISTS (
  SELECT 1 FROM pg_roles WHERE rolname = :'migrator_db_user'
)\gexec

SELECT format(
  'CREATE ROLE %I LOGIN PASSWORD %L NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS',
  :'app_db_user',
  :'app_db_password'
)
WHERE NOT EXISTS (
  SELECT 1 FROM pg_roles WHERE rolname = :'app_db_user'
)\gexec

SELECT format(
  'ALTER ROLE %I WITH LOGIN PASSWORD %L NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS',
  :'migrator_db_user',
  :'migrator_db_password'
)\gexec

SELECT format(
  'ALTER ROLE %I WITH LOGIN PASSWORD %L NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS',
  :'app_db_user',
  :'app_db_password'
)\gexec

SELECT format('GRANT CONNECT, TEMPORARY ON DATABASE %I TO %I', :'database_name', :'migrator_db_user')\gexec
SELECT format('GRANT CONNECT ON DATABASE %I TO %I', :'database_name', :'app_db_user')\gexec
SELECT format('GRANT USAGE, CREATE ON SCHEMA public TO %I', :'migrator_db_user')\gexec
SQL
