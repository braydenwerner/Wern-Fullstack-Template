import { GraphQLInputObjectType, GraphQLInputFieldConfigMap, GraphQLObjectType, GraphQLInterfaceType, GraphQLFieldConfigMap } from "graphql";
export declare function getFieldMetadataFromInputType(type: GraphQLInputObjectType): GraphQLInputFieldConfigMap;
export declare function getFieldMetadataFromObjectType(type: GraphQLObjectType | GraphQLInterfaceType): GraphQLFieldConfigMap<any, any>;
