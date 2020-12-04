FROM node:alpine as builder

WORKDIR /usr/src/app
COPY . .

RUN npm install
RUN npm run build

FROM node:alpine
WORKDIR /app

COPY --from=builder /usr/src/app ./

CMD ["npm", "run", "start:prod"]