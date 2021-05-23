/**
 * Created by Ivo Meißner on 28.07.17.
 */
import { ValidationContext, FragmentDefinitionNode, OperationDefinitionNode, FieldNode, InlineFragmentNode, GraphQLField, GraphQLCompositeType, GraphQLSchema, DocumentNode, GraphQLDirective } from 'graphql';
import { GraphQLUnionType, GraphQLObjectType, GraphQLInterfaceType, GraphQLError } from 'graphql';
export declare type ComplexityEstimatorArgs = {
    type: GraphQLCompositeType;
    field: GraphQLField<any, any>;
    args: {
        [key: string]: any;
    };
    childComplexity: number;
};
export declare type ComplexityEstimator = (options: ComplexityEstimatorArgs) => number | void;
export declare type Complexity = any;
export interface QueryComplexityOptions {
    maximumComplexity: number;
    variables?: Object;
    operationName?: string;
    onComplete?: (complexity: number) => void;
    createError?: (max: number, actual: number) => GraphQLError;
    estimators: Array<ComplexityEstimator>;
}
export declare function getComplexity(options: {
    estimators: ComplexityEstimator[];
    schema: GraphQLSchema;
    query: DocumentNode;
    variables?: Object;
    operationName?: string;
}): number;
export default class QueryComplexity {
    context: ValidationContext;
    complexity: number;
    options: QueryComplexityOptions;
    OperationDefinition: Object;
    estimators: Array<ComplexityEstimator>;
    includeDirectiveDef: GraphQLDirective;
    skipDirectiveDef: GraphQLDirective;
    constructor(context: ValidationContext, options: QueryComplexityOptions);
    onOperationDefinitionEnter(operation: OperationDefinitionNode): void;
    onOperationDefinitionLeave(operation: OperationDefinitionNode): GraphQLError | undefined;
    nodeComplexity(node: FieldNode | FragmentDefinitionNode | InlineFragmentNode | OperationDefinitionNode, typeDef: GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType): number;
    createError(): GraphQLError;
}
