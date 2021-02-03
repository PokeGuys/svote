FROM node:14.15.4-alpine3.11

ENV APP_ENV="production"

# Install app dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn && yarn cache clean

# Build application
RUN yarn build

# Expose port and start application in production mode
EXPOSE 3000
CMD yarn start:prod
