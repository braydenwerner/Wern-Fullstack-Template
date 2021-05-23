"use strict";
/**
 * Created by Ivo Meißner on 28.07.17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const Item = new graphql_1.GraphQLObjectType({
    name: 'Item',
    fields: () => ({
        variableList: {
            type: Item,
            extensions: {
                complexity: (args) => args.childComplexity * (args.args.count || 10)
            },
            args: {
                count: {
                    type: graphql_1.GraphQLInt
                }
            }
        },
        scalar: { type: graphql_1.GraphQLString },
        complexScalar: { type: graphql_1.GraphQLString, extensions: { complexity: 20 } },
        variableScalar: {
            type: Item,
            extensions: {
                complexity: (args) => 10 * (args.args.count || 10)
            },
            args: {
                count: {
                    type: graphql_1.GraphQLInt
                }
            }
        },
        list: { type: new graphql_1.GraphQLList(Item) },
        nonNullItem: {
            type: new graphql_1.GraphQLNonNull(Item),
            resolve: () => ({}),
        },
        nonNullList: {
            type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(Item))),
            resolve: () => [],
        },
    }),
});
const NameInterface = new graphql_1.GraphQLInterfaceType({
    name: 'NameInterface',
    fields: {
        name: { type: graphql_1.GraphQLString }
    },
    resolveType: () => Item
});
const UnionInterface = new graphql_1.GraphQLInterfaceType({
    name: 'UnionInterface',
    fields: () => ({
        union: { type: Union }
    }),
    resolveType: () => Item
});
const SecondItem = new graphql_1.GraphQLObjectType({
    name: 'SecondItem',
    fields: () => ({
        name: { type: graphql_1.GraphQLString },
        scalar: { type: graphql_1.GraphQLString }
    }),
    interfaces: [NameInterface]
});
const EnumType = new graphql_1.GraphQLEnumType({
    name: 'RGB',
    values: {
        RED: { value: 0 },
        GREEN: { value: 1 },
        BLUE: { value: 2 }
    }
});
const Union = new graphql_1.GraphQLUnionType({
    name: 'Union',
    types: [Item, SecondItem],
    resolveType: () => Item
});
const SDLInterface = new graphql_1.GraphQLInterfaceType({
    name: 'SDLInterface',
    fields: {
        sdl: { type: graphql_1.GraphQLString }
    },
    resolveType: () => 'SDL'
});
const SDL = new graphql_1.GraphQLObjectType({
    name: 'SDL',
    fields: {
        sdl: { type: graphql_1.GraphQLString }
    },
    interfaces: () => [SDLInterface],
});
const Query = new graphql_1.GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        name: { type: graphql_1.GraphQLString },
        variableList: {
            type: Item,
            extensions: {
                complexity: (args) => args.childComplexity * (args.args.count || 10)
            },
            args: {
                count: {
                    type: graphql_1.GraphQLInt
                }
            }
        },
        interface: { type: NameInterface },
        enum: { type: EnumType },
        scalar: { type: graphql_1.GraphQLString },
        complexScalar: { type: graphql_1.GraphQLString, extensions: { complexity: 20 } },
        union: { type: Union },
        variableScalar: {
            type: Item,
            extensions: {
                complexity: (args) => 10 * (args.args.count || 10)
            },
            args: {
                count: {
                    type: graphql_1.GraphQLInt
                }
            }
        },
        list: { type: new graphql_1.GraphQLList(Item) },
        nonNullItem: {
            type: new graphql_1.GraphQLNonNull(Item),
            resolve: () => ({}),
        },
        nonNullList: {
            type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(Item))),
            resolve: () => [],
        },
        requiredArgs: {
            type: Item,
            args: {
                count: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
                }
            }
        },
        _service: { type: SDLInterface },
    }),
    interfaces: () => [NameInterface, UnionInterface,]
});
exports.default = new graphql_1.GraphQLSchema({
    query: Query,
    types: [
        SDL,
    ],
});
//# sourceMappingURL=schema.js.map