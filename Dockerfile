FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 3000

RUN yarn build

CMD [ "node", "./dempApp/index.js" ]
