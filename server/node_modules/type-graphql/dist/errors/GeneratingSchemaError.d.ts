import { GraphQLError } from "graphql";
export declare class GeneratingSchemaError extends Error {
    details: ReadonlyArray<GraphQLError>;
    constructor(details: ReadonlyArray<GraphQLError>);
}
