import { BuildSchemaOptions } from "./buildSchema";
export declare function buildTypeDefsAndResolvers(options: BuildSchemaOptions): Promise<{
    typeDefs: string;
    resolvers: import("..").ResolversMap<any, any>;
}>;
