"use strict";
/*
  This "shim" can be used on the frontend to prevent from errors on undefined decorators,
  when you are sharing same classes across backend and frontend.

  To use this shim, simply set up your Webpack configuration
  to use this file instead of a normal TypeGraphQL module.

  ```js
  plugins: [
    // ...here are any other existing plugins that you already have
    new webpack.NormalModuleReplacementPlugin(/type-graphql$/, resource => {
      resource.request = resource.request.replace(/type-graphql/, "type-graphql/dist/browser-shim");
    }),
  ]
  ```

  However, in some TypeScript projects like the ones using Angular,
  which AoT compiler requires that a full `*.ts` file is provided
  instead of just a `*.js` and `*.d.ts` files, to use this shim
  we have to simply set up our TypeScript configuration in `tsconfig.json`
  to use this file instead of a normal TypeGraphQL module:

  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "type-graphql": [
          "./node_modules/type-graphql/dist/browser-shim.ts"
        ]
      }
    }
  }
  ```
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLTimestamp = exports.GraphQLISODateTime = exports.ID = exports.Float = exports.Int = exports.UseMiddleware = exports.createUnionType = exports.Subscription = exports.Root = exports.Resolver = exports.Query = exports.PubSub = exports.ObjectType = exports.Mutation = exports.InterfaceType = exports.InputType = exports.Info = exports.FieldResolver = exports.Field = exports.registerEnumType = exports.Ctx = exports.Authorized = exports.ArgsType = exports.Args = exports.Arg = exports.dummyDecorator = exports.dummyFn = exports.dummyValue = void 0;
exports.dummyValue = "";
function dummyFn() {
    return;
}
exports.dummyFn = dummyFn;
function dummyDecorator() {
    return dummyFn;
}
exports.dummyDecorator = dummyDecorator;
exports.Arg = dummyDecorator;
exports.Args = dummyDecorator;
exports.ArgsType = dummyDecorator;
exports.Authorized = dummyDecorator;
exports.Ctx = dummyDecorator;
exports.registerEnumType = dummyFn;
exports.Field = dummyDecorator;
exports.FieldResolver = dummyDecorator;
exports.Info = dummyDecorator;
exports.InputType = dummyDecorator;
exports.InterfaceType = dummyDecorator;
exports.Mutation = dummyDecorator;
exports.ObjectType = dummyDecorator;
exports.PubSub = dummyDecorator;
exports.Query = dummyDecorator;
exports.Resolver = dummyDecorator;
exports.Root = dummyDecorator;
exports.Subscription = dummyDecorator;
exports.createUnionType = dummyFn;
exports.UseMiddleware = dummyDecorator;
exports.Int = exports.dummyValue;
exports.Float = exports.dummyValue;
exports.ID = exports.dummyValue;
exports.GraphQLISODateTime = exports.dummyValue;
exports.GraphQLTimestamp = exports.dummyValue;
