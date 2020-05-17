FROM node:12
WORKDIR "/app"

ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

ARG FB_APP_SECRET
ENV FB_APP_SECRET=$FB_APP_SECRET

ARG JWT_SECRET
ENV JWT_SECRET=$JWT_SECRET

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./client/package.json ./client/package.json
COPY ./client/yarn.lock ./client/yarn.lock
RUN yarn setup
COPY ./ .
CMD ["yarn", "start"]
