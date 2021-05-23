"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLTimestamp = void 0;
const graphql_1 = require("graphql");
function convertTimestampToDate(value) {
    try {
        return new Date(value);
    }
    catch (err) {
        throw new Error("Provided date numeric value is invalid and cannot be parsed");
    }
}
exports.GraphQLTimestamp = new graphql_1.GraphQLScalarType({
    name: "Timestamp",
    description: "The javascript `Date` as integer. " +
        "Type represents date and time as number of milliseconds from start of UNIX epoch.",
    serialize(value) {
        if (!(value instanceof Date)) {
            throw new Error(`Unable to serialize value '${value}' as it's not an instance of 'Date'`);
        }
        return value.getTime();
    },
    parseValue(value) {
        if (typeof value !== "number") {
            throw new Error(`Unable to parse value '${value}' as GraphQLTimestamp scalar supports only number values`);
        }
        return convertTimestampToDate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.INT) {
            throw new Error(`Unable to parse literal value of kind '${ast.kind}' as GraphQLTimestamp scalar supports only '${graphql_1.Kind.INT}' ones`);
        }
        const num = Number.parseInt(ast.value, 10);
        return convertTimestampToDate(num);
    },
});
