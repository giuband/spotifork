FROM node:carbon
RUN mkdir spotifork
WORKDIR spotifork

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm", "start" ]
