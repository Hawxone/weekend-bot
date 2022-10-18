FROM node:16.18.0

ENV HOST 0.0.0.0
ENV PORT 8080
EXPOSE 8080

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g node-gyp
RUN npm install

COPY . .

CMD ["node","./src/bot.js"]
