#!/bin/sh

echo "⏳ Waiting for MySQL..."
until nc -z -v -w30 "$DB_HOST" "$DB_PORT"; do
  echo "Waiting for database connection..."
  sleep 3
done
echo "✅ MySQL is up"

echo "Running migrations..."
npm run migration:up

exec "$@"
