import { ApolloServerPlugin } from "apollo-server-plugin-base";
export interface TracingFormat {
    version: 1;
    startTime: string;
    endTime: string;
    duration: number;
    execution: {
        resolvers: {
            path: (string | number)[];
            parentType: string;
            fieldName: string;
            returnType: string;
            startOffset: number;
            duration: number;
        }[];
    };
}
export declare const plugin: (_futureOptions?: {}) => () => ApolloServerPlugin;
//# sourceMappingURL=index.d.ts.map