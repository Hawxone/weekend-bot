FROM node:16.18.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g node-gyp
RUN npm install

COPY . .

CMD ["node","./src/bot.js"]
