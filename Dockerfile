FROM node:8.12.0-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app/

RUN yarn install --production && yarn cache clean;rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

# force to run in http
ENV IGNORE_CERTS true

HEALTHCHECK --interval=10s --timeout=10s --retries=10 CMD http_proxy= curl -k --silent --fail https://localhost:3000/health

EXPOSE 3000
CMD [ "yarn", "start" ]
