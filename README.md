```bash
├── LICENSE
├── README.md
├── client
│   ├── README.md
│   ├── codegen.yml
│   ├── next-env.d.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── components
│   │   │   ├── elements
│   │   │   │   ├── Wrapper
│   │   │   │   │   └── Wrapper.tsx
│   │   │   │   └── index.ts
│   │   │   └── modules
│   │   │   ├── UserCard
│   │   │   │   ├── UserCard.styled.ts
│   │   │   │   └── UserCard.tsx
│   │   │   └── index.ts
│   │   ├── config
│   │   │   └── config.ts
│   │   ├── generated
│   │   │   └── graphql.tsx
│   │   ├── graphql
│   │   │   ├── fragments
│   │   │   ├── mutations
│   │   │   │   └── createUser.graphql
│   │   │   └── queries
│   │   │   ├── getUser.graphql
│   │   │   └── getUsers.graphql
│   │   ├── hooks
│   │   │   └── useMediaQuery.ts
│   │   ├── pages
│   │   │   ├── 404.tsx
│   │   │   ├── \_app.tsx
│   │   │   ├── \_document.tsx
│   │   │   ├── api
│   │   │   │   └── hello.ts
│   │   │   └── index.tsx
│   │   ├── providers
│   │   │   └── AppProvider.tsx
│   │   ├── public
│   │   ├── styles
│   │   │   ├── constantStyles.ts
│   │   │   ├── global.ts
│   │   │   ├── index.ts
│   │   │   ├── styled.d.ts
│   │   │   └── theme.ts
│   │   └── util
│   │   └── util.ts
│   └── tsconfig.json
├── server
│   ├── Dockerfile
│   ├── dist
│   │   ├── config.js
│   │   ├── config.js.map
│   │   ├── entities
│   │   │   ├── User.js
│   │   │   ├── User.js.map
│   │   │   ├── index.js
│   │   │   └── index.js.map
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── resolvers
│   │   │   ├── index.js
│   │   │   ├── index.js.map
│   │   │   ├── user.js
│   │   │   ├── user.js.map
│   │   │   ├── userInput.js
│   │   │   └── userInput.js.map
│   │   ├── types.js
│   │   ├── types.js.map
│   │   └── utils
│   │   ├── validateRegister.js
│   │   └── validateRegister.js.map
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── config.ts
│   │   ├── entities
│   │   │   ├── User.ts
│   │   │   └── index.ts
│   │   ├── env.d.ts
│   │   ├── index.ts
│   │   ├── middleware
│   │   │   └── isAuth.ts
│   │   ├── migrations
│   │   ├── resolvers
│   │   │   ├── index.ts
│   │   │   ├── user.ts
│   │   │   └── userInput.ts
│   │   ├── types.ts
│   │   └── utils
│   │   └── validateRegister.ts
│   └── tsconfig.json
└── tree.txt

31 directories, 65 files
```
