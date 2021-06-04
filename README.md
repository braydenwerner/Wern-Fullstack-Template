<p align="center">
  <img src="https://i.imgur.com/Rz2joyj.jpg" alt="phone-rig-image" width="95%"/>
</p>

## This repo is inspired by https://github.com/benawad/lireddit

<br>

## Features Include:

- Server-side rendered data from postgres
- Create user graphql mutation with password encryption
- Get users/user graphql query
- Light/dark theme support and switch component
  <br>

## Uses the following technologies:

- React
- Next.js
- MaterialUI
- Styled-Components
- TypeGraphQL
- URQL
- ApolloServer(express)
- TypeORM
- PostgresSQL
- Node.js
- TypeScript
  <br>

## Running Locally:

### <b>Client:</b>

```
npm install
npm run dev
```

### <b>Server:</b> (You must have a postgreSQL database running and update the DATABASE_URL in server/.env if you wish to add database functionality)

### A migration to create the users table can be found in server/src/migrations. To run it, uncomment the following line in server/src/index.ts

<br>

```
await conn.runMigrations()
```

```
npm install
npm run build
npm run dev2
```

<br>

## Folder Structure

```bash
├── client
│   └── src
│       ├── components
│       │   ├── elements
│       │   └── modules
│       ├── config
│       ├── generated
│       ├── graphql
│       │   ├── fragments
│       │   ├── mutations
│       │   └── queries
│       ├── hooks
│       ├── pages
│       │   └── api
│       ├── providers
│       ├── public
│       │   ├── fonts
│       │   └── images
│       ├── styles
│       └── util
└── server
    ├── dist
    │   ├── entities
    │   ├── middleware
    │   ├── resolvers
    │   └── utils
    └── src
        ├── entities
        ├── middleware
        ├── migrations
        ├── resolvers
        └── utils
```

## Hosting:

### Client</b>: Hosted with vercel

### Server: Hosted with Heroku using PostgreSQL plugin
