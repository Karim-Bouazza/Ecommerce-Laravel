#!/bin/sh
# First deploy / any deploy: makes sure a Let's Encrypt certificate exists,
# then starts the whole stack.
#
#   ./init-letsencrypt.sh
#
# nginx cannot start without a certificate, and the certbot service only
# *renews* certificates, so the very first one is issued here with certbot's
# standalone server on port 80 (while nginx is stopped). Afterwards the certbot
# service renews it through nginx's /.well-known/acme-challenge/ webroot.
set -e
cd "$(dirname "$0")"

ENV_FILE=.env.prod
COMPOSE="docker compose --env-file $ENV_FILE -f docker-compose.prod.yml"

if [ ! -f "$ENV_FILE" ]; then
    echo "Missing $ENV_FILE (cp env.prod.example .env.prod and fill it in)." >&2
    exit 1
fi

read_env() {
    grep -E "^$1=" "$ENV_FILE" | tail -n 1 | cut -d= -f2- | tr -d "\"'\r"
}

DOMAIN=$(read_env DOMAIN)
EMAIL=$(read_env CERTBOT_EMAIL)

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "DOMAIN and CERTBOT_EMAIL must be set in $ENV_FILE." >&2
    exit 1
fi

if $COMPOSE run --rm --no-deps --entrypoint test certbot \
    -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem"; then
    echo "Certificate for $DOMAIN already exists, skipping issuance."
else
    echo "No certificate for $DOMAIN yet, requesting one..."
    # Port 80 must be free for the standalone challenge server.
    $COMPOSE stop nginx 2>/dev/null || true
    $COMPOSE run --rm --no-deps -p 80:80 --entrypoint certbot certbot \
        certonly --standalone \
        --non-interactive --agree-tos --no-eff-email \
        -m "$EMAIL" \
        --cert-name "$DOMAIN" \
        -d "$DOMAIN" -d "api.$DOMAIN"
fi

$COMPOSE up -d --build
