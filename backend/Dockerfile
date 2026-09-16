# syntax=docker/dockerfile:1

# --- vendor: PHP dependencies only, cached separately from app code ---
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
# --ignore-platform-reqs: this stage only resolves/downloads packages, it never
# executes app code, so the composer image's own PHP version/extensions (which
# won't match the runtime image) don't matter here.
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --ignore-platform-reqs

# --- assets: Vite build for resources/{css,js}/app.* consumed by Blade/Filament ---
FROM node:22-alpine AS assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY vite.config.js ./
COPY resources ./resources
COPY public ./public
# app.css imports vendor/livewire/flux's own CSS directly, so Vite needs
# composer's output present at build time too, not just npm's.
COPY --from=vendor /app/vendor ./vendor
RUN npm run build

# --- production: FrankenPHP + Laravel Octane, single process, no separate nginx/php-fpm ---
# If this exact tag 404s on Docker Hub by the time you build, swap it for
# whatever the current "php8.3-alpine" tag is at https://hub.docker.com/r/dunglas/frankenphp/tags
FROM dunglas/frankenphp:1-php8.3-alpine AS production
WORKDIR /app

# install-php-extensions is baked into the frankenphp image (docker-php-extension-installer).
RUN install-php-extensions \
    pdo_mysql \
    bcmath \
    gd \
    intl \
    zip \
    exif \
    pcntl \
    redis \
    opcache \
    && apk add --no-cache su-exec

COPY docker/php.ini /usr/local/etc/php/conf.d/99-app.ini

# FrankenPHP's image has no composer of its own; borrow the binary from the
# vendor stage just to regenerate the autoloader below.
COPY --from=vendor /usr/bin/composer /usr/bin/composer

COPY --from=vendor /app/vendor ./vendor
COPY . .
COPY --from=assets /app/public/build ./public/build

RUN chmod +x docker/entrypoint.sh \
    && composer dump-autoload --optimize --classmap-authoritative --no-dev \
    && php artisan storage:link \
    && addgroup -g 1000 octane \
    && adduser -D -u 1000 -G octane octane \
    && chown -R octane:octane /app

# ${DOMAIN} substitution happens at the edge nginx; Octane just binds this port.
ENV OCTANE_SERVER=frankenphp
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8000/up || exit 1

ENTRYPOINT ["docker/entrypoint.sh"]
CMD ["php", "artisan", "octane:start", "--server=frankenphp", "--host=0.0.0.0", "--port=8000"]
