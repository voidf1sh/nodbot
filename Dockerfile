FROM node:16
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json ./
RUN npm install
COPY . .
CMD ["/bin/sh", "-c", "node main.js 2> /logs/nodbot.error 1> /logs/nodbot.log"]