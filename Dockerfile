FROM node:16.16.0-alpine AS INSTALLER

WORKDIR /usr/src/app
COPY package.json yarn.lock ./

RUN yarn build
RUN yarn global add @nestjs/cli

COPY . .
RUN yarn --prod

FROM node:16.16.0-alpine

WORKDIR /usr/src/app

COPY --from=INSTALLER /usr/src/app .

ENV NODE_ENV production
ARG DB_HOST 
ARG DB_PORT 
ARG DB_USERNAME 
ARG DB_PASSWORD 
ARG DB_DATABASE 
ARG CONTAINER_PORT 

CMD ["node", "dist/main.js"]
EXPOSE ${CONTAINER_PORT}