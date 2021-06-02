<h1>Wern Fullstack Template</h1>
<h2>Features Include:</h2>
<li>Server-side rendered data from postgres</li>
<li>Create user graphql mutation with password encryption</li>
<li>Get users/user graphql query</li>
<li>Light/dark theme support and switch component</li>
<br>

<h2>Uses the following technologies:</h2>
<li>React</li>
<li>Next.js</li>
<li>MaterialUI</li>
<li>Styled-Components</li>
<li>TypeGraphQL</li>
<li>URQL</li>
<li>ApolloServer(express)</li>
<li>TypeORM</li>
<li>PostgresSQL</li>
<li>Node.js</li>
<li>TypeScript</li>
<br>

<h2>Running Locally:</h2>
<h3><b>Client:</b></h3>

```
npm install
npm run dev
```

</pre>
<h3><b>Server:</b> (You must have a postgreSQL database running and update the DATABASE_URL in server/.env if you wish to add database functionality)
</h3>
<br>
<h4>A migration to create the users table can be found in server/src/migrations. To run it, uncomment the following line in server/src/index.ts</h4>

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

<h2>Folder Structure</h2>

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

<h2>Hosting:</h2>
<h3>Client</b>: Hosted with vercel</h3>
<h3>Server: Hosted with Heroku using PostgreSQL plugin</h3>
