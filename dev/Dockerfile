FROM node:18-bookworm

ARG TARGETOS
ARG TARGETARCH
ARG TARGETVARIANT
ARG VERSION=1.0

ENV WEBUI_PORT=${WEBUI_PORT:-8008}

EXPOSE ${WEBUI_PORT}

USER root
WORKDIR /var/app

RUN apt update && \
    apt install -y curl && \
    apt install -y gnupg2

RUN curl -SsL https://playit-cloud.github.io/ppa/key.gpg | gpg --dearmor | tee /etc/apt/trusted.gpg.d/playit.gpg >/dev/null && \
    echo "deb [signed-by=/etc/apt/trusted.gpg.d/playit.gpg] https://playit-cloud.github.io/ppa/data ./" | tee /etc/apt/sources.list.d/playit-cloud.list && \
    apt update && \
    apt install -y playit

VOLUME /config

VOLUME /var/app/backend
VOLUME /var/app/frontend

