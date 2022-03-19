FROM node:17-slim

RUN apt-get update && apt-get install -y sox libsox-fmt-mp3

WORKDIR /app/

COPY package.json package-lock.json /app/

RUN npm ci --silent

COPY . .

USER node

CMD npm run live-reload