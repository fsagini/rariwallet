# Building Locally

## Prerequisites Quickstart

- Install Docker https://docs.docker.com/get-docker/ and configure it correctly.
- [optional] Install Postgres https://www.postgresql.org/download/ (optional if you work with Docker).
- [optional] Install Node.js and Npm https://nodejs.org/en/download/ (optional if you work with Docker).
- Git clone this repo and `cd` into it.

  ```
  git clone https://github.com/fsagini/rariwallet.git
  cd rariwallet
  ```

## Installation

You can deploy rariwallet on your local/cloud machine for testing in two ways:

1. You can deploy using Docker (very quick).
2. You can setup a Postgres database, install Node.js and Npm and run every component separately.

### Setting up the wallet with Docker (quickstart)

Run `docker compose up`.

- Postgres database, backend and frontend will be automatically setup through the Docker scripts.
- Postgres database will be deployed at: `http://127.0.0.1:5432`.
  - User "postgres", password "example", db "zerowallet"
- Backend will be deployed at: `http://127.0.0.1:8080`.
- Frontend will be deployed at: `http://127.0.0.1:3001`.

### Setting up the wallet with Node.js and Npm

#### Setting up backend

- Run `npm install` in the `backend-node` directory.
- Rename the `.env.example.` to `.env`.
- Input the correct database `DB_` variables.
- Run `npm run start`.
- Run `npm run db:seed` to populate the database with the initial data.
- Backend will be deployed at: `http://127.0.0.1:8080`.

#### Setting up frontend

- Run `npm install` in the `vue` directory.
- Run `npm run serve` to start the frontend process.
- Frontend will be deployed at: `http://127.0.0.1:3001`.
