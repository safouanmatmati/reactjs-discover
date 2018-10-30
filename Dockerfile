ARG NODE_VERSION=10.12.0-alpine

FROM node:${NODE_VERSION} as node

# Set working directory
RUN mkdir -p /srv/app
WORKDIR /srv/app

# Prevent the reinstallation of node modules at every changes in the source code
COPY package.json yarn.lock ./

RUN yarn

COPY . ./
EXPOSE 3000

# start app
CMD ["yarn", "start"]
