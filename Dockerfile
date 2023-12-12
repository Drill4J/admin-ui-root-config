# build environment
FROM node:16.17.0-alpine as build
ARG ENV
ARG VERSION
ARG API_HOST
ENV REACT_APP_ENV "$ENV"
ENV REACT_APP_VERSION "$VERSION"
ENV REACT_APP_API_HOST "$API_HOST"

WORKDIR /app
COPY . /app

RUN npm install --force
RUN npm run build

# production environment
FROM nginx:1.25.0-alpine-perl
ENV UPSTREAM "drill-admin:8090"
ENV NGINX_PORT="8080"

# support running as arbitrary user which belogs to the root group
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/ /etc/nginx/
RUN addgroup nginx root

# setup wait utility
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

# add bash
RUN apk add bash

# copy script to create plugins.json employed by UI to download plugins from NPM
COPY --from=build /app/parse-plugin-env.sh .
RUN chmod +x ./parse-plugin-env.sh

# copy static files to nginx
COPY --from=build /app/dist /usr/share/nginx/html
RUN chgrp -R 0 /usr/share/nginx/html && chmod -R g=u /usr/share/nginx/html

COPY nginx /etc/nginx/
EXPOSE $NGINX_PORT
CMD /bin/bash ./parse-plugin-env.sh && /wait && /bin/sh -c "envsubst < /etc/nginx/upsteam.conf.template > /etc/nginx/upstream.conf && sed -i \"s/listen 8080/listen $NGINX_PORT/g\" ./etc/nginx/nginx.conf && cat /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"
