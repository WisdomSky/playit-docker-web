FROM mirror.gcr.io/library/node:18-bookworm-slim

ARG TARGETOS
ARG TARGETARCH
ARG TARGETVARIANT
ARG VERSION=1.0.9

ENV WEBUI_PORT=${WEBUI_PORT:-8008}

EXPOSE ${WEBUI_PORT}

USER root
WORKDIR /var/app

RUN apt update && \
    apt install -y curl && \
    apt install -y gnupg2 && \
    apt install -y ca-certificates

RUN case "${TARGETARCH}${TARGETVARIANT}" in \
      arm64)   ARCH="aarch64" ;; \
      armv7)   ARCH="armv7"   ;; \
      amd64)   ARCH="amd64"   ;; \
      *) echo "Unsupported arch: ${TARGETARCH}${TARGETVARIANT}" && exit 1 ;; \
    esac && \
    curl -fsSL "https://github.com/playit-cloud/playit-agent/releases/download/v${VERSION}/playit-linux-${ARCH}" \
    -o /usr/local/bin/playit && \
    chmod +x /usr/local/bin/playit

VOLUME /config

VOLUME /var/app/backend
VOLUME /var/app/frontend