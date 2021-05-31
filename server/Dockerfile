FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
COPY .env.production .env

ENV NODE_ENV production

EXPOSE 8080
CMD [ "node", "dist/index.js" ]