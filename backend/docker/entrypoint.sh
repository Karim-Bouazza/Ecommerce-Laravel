#!/bin/sh
set -e

# The storage/bootstrap-cache volumes are mounted fresh (root-owned) by Docker
# on first run, so the app user can't write to them until we fix ownership here.
chown -R octane:octane storage bootstrap/cache

su-exec octane php artisan config:cache
su-exec octane php artisan event:cache
su-exec octane php artisan route:cache
su-exec octane php artisan view:cache

# --isolated skips the run if a migration is already in progress on another
# instance/container, so scaling backend replicas doesn't race the schema.
su-exec octane php artisan migrate --force

# Idempotent (keyed on ADMIN_EMAIL): guarantees a way into /admin after every
# deploy without an interactive `make:filament-user` step.
su-exec octane php artisan db:seed --class="Database\\Seeders\\AdminUserSeeder" --force

exec su-exec octane "$@"
