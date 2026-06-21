#!/bin/sh
# docker-entrypoint.sh
# Zorgt dat de SQLite-database en tabellen bestaan voordat de server start.
set -e

echo "Database synchroniseren..."
node ./node_modules/prisma/build/index.js db push --skip-generate

echo "Server starten..."
exec node server.js
