FROM node:17 as builder

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

COPY . /app

RUN npm ci
RUN npm run build

FROM node:17-alpine

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

ENV NODE_ENV=production

RUN npm ci

COPY ./config/default.json /app/config/default.json
COPY ./config/custom-environment-variables.json /app/config/custom-environment-variables.json

RUN addgroup -S amrender && adduser -S amrender -G amrender
RUN chown -R amrender:amrender /app

USER amrender

CMD ["node", "dist/index.js"]
