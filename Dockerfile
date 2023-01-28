### STAGE 1: Build APP ###
FROM node:16.15 as builder-app

RUN npm config set unsafe-perm true && mkdir /app

COPY . /app/nest-api
WORKDIR /app/nest-api
RUN npm i -g npm@8.13.0
RUN npm i -g @nestjs/cli
RUN npm ci
RUN npm run build
### STAGE 2: Nginx ###
FROM node:16.15 as main
LABEL maintainer="office@pandarium.pro"

ENV TZ=UTC+3
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY --from=builder-app /app/nest-api /app/nest-api
# COPY ./front-admin/dist /app/front-admin
WORKDIR /app/nest-api

CMD ["npm", "run", "start:prod"]
EXPOSE 3000

