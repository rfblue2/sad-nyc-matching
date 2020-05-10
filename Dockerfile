FROM node:alpine
WORKDIR "/app"

ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./client/package.json ./client/package.json
COPY ./client/yarn.lock ./client/yarn.lock
RUN yarn setup
COPY ./ .
CMD ["yarn", "start"]
