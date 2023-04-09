FROM node:18
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY src/package.json ./
RUN npm install
COPY ./src .
CMD [ "node", "main.js" ]