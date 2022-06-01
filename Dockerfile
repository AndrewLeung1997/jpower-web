FROM node:16-alpine as build

ARG env
ENV env $env

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./tsconfig.json ./

RUN yarn install

COPY ./src ./src
COPY ./public ./public

RUN if [ "$env" = "dev" ]; then mkdir build; else yarn build; fi;

FROM node:16-alpine

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./tsconfig.json ./

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/build ./build

CMD if [ "$env" = "dev" ]; then yarn start; else npx -y serve -s build -l 8080; fi;
