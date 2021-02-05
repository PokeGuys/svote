# Setup Guide

## First-time setup

Make sure you have the following installed:

- [Node](https://nodejs.org/en/) (the latest LTS)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)

## Installation

```bash
# Install dependencies from package.json
yarn
```

### Configuration

Before start install PostgreSQL, fill the correct configurations in `.env` file

```ini
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=svote
DB_PASSWORD=secret
DB_DATABASE=svote
```

### Scripts and Deployment

```bash
# Lints and fixes files
yarn lint

# Unit test
yarn test

# Unit test with coverage
yarn test:cov

# launch dev server with file watcher
yarn start:dev

# Launch dev server with node inspect flag
yarn start:debug

# Launch production server
yarn start

# Compiles and deploy for production
yarn build
yarn start:prod
```

## Docker

### Run

Open terminal, navigate to project root, and run the following command.

```bash
docker-compose up
```

> Note: Application will run on port 3000 (<http://localhost:3000>)
