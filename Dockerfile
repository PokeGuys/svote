FROM node:fermium-alpine as dist

# Install app dev dependencies
COPY package.json yarn.lock ./
RUN yarn install

COPY . ./

# Build application
RUN yarn build

FROM node:fermium-alpine as node_modules

# Install app production dependencies
COPY package.json yarn.lock ./
RUN yarn install --prod

FROM node:fermium-alpine

ENV APP_ENV="production"

# Configurate application dist folder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY --from=dist dist /usr/src/app/dist
COPY --from=node_modules node_modules /usr/src/app/node_modules

COPY . /usr/src/app

# Expose port and start application in production mode
EXPOSE 3000
CMD ["yarn", "start:prod"]
