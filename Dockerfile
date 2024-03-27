
FROM node:latest AS build

ENV NODE_ENV=production
ENV PORT=3000

RUN apt-get update && apt-get install -y python3 python3-venv

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:slim

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --from=build /app .

EXPOSE $PORT

CMD ["node", "app.js"]
