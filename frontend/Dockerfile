FROM node:carbon
RUN mkdir -p spotifork/frontend
WORKDIR spotifork/frontend

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "run", "build" ]
