FROM node:carbon
RUN mkdir -p spotifork/server
WORKDIR spotifork/server

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm", "start" ]
