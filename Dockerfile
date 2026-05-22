FROM node:18-bullseye-slim

ARG TARGETOS
ARG TARGETARCH
ARG TARGETVARIANT
ARG VERSION=1.0

ENV WEBUI_PORT=${WEBUI_PORT:-8008}

EXPOSE ${WEBUI_PORT}

USER root
WORKDIR /var/app

RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://playit-cloud.github.io/ppa/key.gpg | gpg --dearmor -o /etc/apt/keyrings/playit.gpg

RUN echo "deb [signed-by=/etc/apt/keyrings/playit.gpg] https://playit-cloud.github.io/ppa/data stable main" \
    > /etc/apt/sources.list.d/playit.list

RUN apt-get update && apt-get install -y playit

VOLUME /config

COPY app/backend /var/app/backend
COPY app/frontend /var/app/frontend

RUN cd /var/app/frontend && npm install && npm run build
RUN cd /var/app/backend && npm install

ENTRYPOINT bash /var/app/backend/entrypoint.sh
