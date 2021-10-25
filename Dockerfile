# Node Image
FROM node:17
WORKDIR /usr/src/app

# install nodejs packages
COPY package*.json ./
RUN npm install

# add required folders
RUN mkdir /usr/src/app/logs
RUN mkdir /usr/src/app/maxmind

COPY . .

CMD ["node", "index.js"]