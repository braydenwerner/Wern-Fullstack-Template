import { ObjectTypeDefinitionNode, InputObjectTypeDefinitionNode, GraphQLOutputType, FieldDefinitionNode, GraphQLInputType, InputValueDefinitionNode, DirectiveNode } from "graphql";
import { DirectiveMetadata } from "../metadata/definitions";
export declare function getObjectTypeDefinitionNode(name: string, directiveMetadata?: DirectiveMetadata[]): ObjectTypeDefinitionNode | undefined;
export declare function getInputObjectTypeDefinitionNode(name: string, directiveMetadata?: DirectiveMetadata[]): InputObjectTypeDefinitionNode | undefined;
export declare function getFieldDefinitionNode(name: string, type: GraphQLOutputType, directiveMetadata?: DirectiveMetadata[]): FieldDefinitionNode | undefined;
export declare function getInputValueDefinitionNode(name: string, type: GraphQLInputType, directiveMetadata?: DirectiveMetadata[]): InputValueDefinitionNode | undefined;
export declare function getDirectiveNode(directive: DirectiveMetadata): DirectiveNode;
