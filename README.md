<h1>Wern Fullstack Template</h1>
<h3>Features Include:</h3>
<li>Light/dark theme support</li>
<li>Server-side rendered data from postgres</li>
<li>A create user graphql mutation with password encryption</li>
<br>

<h3>Uses the following technologies:</h3>
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

<h3>Running locally:</h3>
<h3><b>Make sure to have a postgres database running on localhost. Specify the port # and the database name in server/.env</b></h3>
<h3>Example:</h3>

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/test
PORT=4000
```

<br>

```
$ git clone https://github.com/braydenwerner/Fullstack-Wern-Boilerplate
$ cd Fullstack-Wern-Boilerplate
$ cd client
$ npm install
$ npm run dev
$ cd ../server
$ npm install
$ npm run watch
$ npm run build2
```

```bash
├── client
│   └── src
│       ├── components
│       │   ├── elements
│       │   │   └── ThemeToggle
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

<h3>Hosting:</h3>
<h3>Client</b>: Hosted with vercel</h3>
<h3>Server: Hosted with Heroku using PostgreSQL plugin</h3>
