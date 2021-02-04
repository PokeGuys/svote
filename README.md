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
- [ ] Housekeeping ended campaign voter data

## Setup

### Software Stack

SVote is a Nest.js, fastify based, application that run on the following software:

- Alpine Linux 3.11
- PostgreSQL 13.1
- Redis 6.0
- Node.js 14.15.4

To install all the required stack on a server, we used Docker to build the application image.

### Installation

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
