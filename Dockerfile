# Node Image
FROM node:17
WORKDIR /usr/src/app

# install nodejs packages
COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "index.js"]