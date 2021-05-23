import { GraphQLSchema } from "graphql";
import { SchemaGeneratorOptions } from "../schema/schema-generator";
import { PrintSchemaOptions } from "./emitSchemaDefinitionFile";
import { NonEmptyArray } from "../interfaces/NonEmptyArray";
interface EmitSchemaFileOptions extends Partial<PrintSchemaOptions> {
    path?: string;
}
export interface BuildSchemaOptions extends Omit<SchemaGeneratorOptions, "resolvers"> {
    /** Array of resolvers classes or glob paths to resolver files */
    resolvers: NonEmptyArray<Function> | NonEmptyArray<string>;
    /**
     * Path to the file to where emit the schema
     * or config object with print schema options
     * or `true` for the default `./schema.gql` one
     */
    emitSchemaFile?: string | boolean | EmitSchemaFileOptions;
}
export declare function buildSchema(options: BuildSchemaOptions): Promise<GraphQLSchema>;
export declare function buildSchemaSync(options: BuildSchemaOptions): GraphQLSchema;
export {};
