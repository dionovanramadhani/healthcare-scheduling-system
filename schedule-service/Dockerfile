FROM node:20-alpine

# Install build tools for native npm dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3002

CMD ["npm", "run", "start:prod"]
