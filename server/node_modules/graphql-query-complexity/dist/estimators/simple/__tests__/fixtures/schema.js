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
            args: {
                count: {
                    type: graphql_1.GraphQLInt
                }
            }
        },
        scalar: { type: graphql_1.GraphQLString },
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
const Query = new graphql_1.GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        name: { type: graphql_1.GraphQLString },
        variableList: {
            type: Item,
            args: {
                count: {
                    type: graphql_1.GraphQLInt
                }
            }
        },
        interface: { type: NameInterface },
        enum: { type: EnumType },
        scalar: { type: graphql_1.GraphQLString },
        union: { type: Union },
        variableScalar: {
            type: Item,
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
        }
    }),
});
exports.default = new graphql_1.GraphQLSchema({ query: Query });
//# sourceMappingURL=schema.js.map