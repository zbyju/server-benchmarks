FROM node:lts-alpine
WORKDIR /usr/app
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 4000
RUN npm install -g nodemon
CMD ["node", "index.js"]
