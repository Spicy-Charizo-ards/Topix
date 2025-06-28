FROM node:18-slim

WORKDIR /user/src/app

COPY . /user/src/

RUN npm install

RUN apt-get update -y && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

RUN npx prisma generate --schema ../prisma/schema.prisma

RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "node ./server/server.js" ]