import { GraphQLSchema } from "graphql";
import { Options as GraphQLPrintSchemaOptions } from "graphql/utilities/printSchema";
export interface PrintSchemaOptions extends Required<GraphQLPrintSchemaOptions> {
    sortedSchema: boolean;
}
export declare const defaultPrintSchemaOptions: PrintSchemaOptions;
export declare function emitSchemaDefinitionFileSync(schemaFilePath: string, schema: GraphQLSchema, options?: PrintSchemaOptions): void;
export declare function emitSchemaDefinitionFile(schemaFilePath: string, schema: GraphQLSchema, options?: PrintSchemaOptions): Promise<void>;
