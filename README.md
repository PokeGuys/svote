# SVote

## Introduction

This repository is code release for the Simple Voting project. It provides a simple, real-time, and secure system for people to express their opinions.

## Features

- [x] Starting up a campaign with time constraint
- [x] Voting
- [x] Real-time vote count
- [x] Display vote count after user vote for the poll
- [x] Using hashing to protect voters' information
- [x] List all voting campaign, order by:
  1. Active campaigns
  2. Most recent ended campaign
- [x] Housekeeping ended campaign voter data

## Quick Start

To install all the required stack on a server, we used Docker to build the application image.

```bash
# 1. Clone the repository
git clone https://github.com/pokeguys/svote.git
cd svote

# 2. Install Dependencies
yarn

# 3. Create a ".env" file
cp .env.example .env

# 4. Open ".env" file and enter the service info.
# 5. Run Svote via Docker
docker-compose up
```

## Documentation

This project includes a `docs` folder with more details on:

1. [Setup and development](./docs/development.md)
2. [Architecture and design decision](./docs/architecture.md)

## Fontend Demo

SVote-vue (<https://github.com/pokeguys/svote-vue>)

## API Documentation

Swagger (<http://localhost:3000/docs/api>)
