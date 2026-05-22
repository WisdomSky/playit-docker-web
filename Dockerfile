FROM mirror.gcr.io/library/node:18-bookworm-slim

ARG TARGETOS
ARG TARGETARCH
ARG TARGETVARIANT
ARG VERSION=1.0.4

ENV WEBUI_PORT=${WEBUI_PORT:-8008}

EXPOSE ${WEBUI_PORT}

USER root
WORKDIR /var/app

RUN apt update && \
    apt install -y curl && \
    apt install -y gnupg2 && \
    apt install -y ca-certificates



RUN ARCH=$([ "$TARGETARCH" = "arm64" ] && echo "aarch64" || echo "x86_64") && \
    curl -fsSL "https://github.com/playit-cloud/playit-agent/releases/download/v${VERSION}/playit-linux-${ARCH}" \
    -o /usr/local/bin/playit && \
    chmod +x /usr/local/bin/playit


VOLUME /config

COPY app/backend /var/app/backend
COPY app/frontend /var/app/frontend

RUN cd /var/app/frontend && npm install && npm run build
RUN cd /var/app/backend && npm install

ENTRYPOINT bash /var/app/backend/entrypoint.sh
