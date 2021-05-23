"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirectiveNode = exports.getInputValueDefinitionNode = exports.getFieldDefinitionNode = exports.getInputObjectTypeDefinitionNode = exports.getObjectTypeDefinitionNode = void 0;
const graphql_1 = require("graphql");
const errors_1 = require("../errors");
function getObjectTypeDefinitionNode(name, directiveMetadata) {
    if (!directiveMetadata || !directiveMetadata.length) {
        return;
    }
    return {
        kind: "ObjectTypeDefinition",
        name: {
            kind: "Name",
            // FIXME: use proper AST representation
            value: name,
        },
        directives: directiveMetadata.map(getDirectiveNode),
    };
}
exports.getObjectTypeDefinitionNode = getObjectTypeDefinitionNode;
function getInputObjectTypeDefinitionNode(name, directiveMetadata) {
    if (!directiveMetadata || !directiveMetadata.length) {
        return;
    }
    return {
        kind: "InputObjectTypeDefinition",
        name: {
            kind: "Name",
            // FIXME: use proper AST representation
            value: name,
        },
        directives: directiveMetadata.map(getDirectiveNode),
    };
}
exports.getInputObjectTypeDefinitionNode = getInputObjectTypeDefinitionNode;
function getFieldDefinitionNode(name, type, directiveMetadata) {
    if (!directiveMetadata || !directiveMetadata.length) {
        return;
    }
    return {
        kind: "FieldDefinition",
        type: {
            kind: "NamedType",
            name: {
                kind: "Name",
                value: type.toString(),
            },
        },
        name: {
            kind: "Name",
            value: name,
        },
        directives: directiveMetadata.map(getDirectiveNode),
    };
}
exports.getFieldDefinitionNode = getFieldDefinitionNode;
function getInputValueDefinitionNode(name, type, directiveMetadata) {
    if (!directiveMetadata || !directiveMetadata.length) {
        return;
    }
    return {
        kind: "InputValueDefinition",
        type: {
            kind: "NamedType",
            name: {
                kind: "Name",
                value: type.toString(),
            },
        },
        name: {
            kind: "Name",
            value: name,
        },
        directives: directiveMetadata.map(getDirectiveNode),
    };
}
exports.getInputValueDefinitionNode = getInputValueDefinitionNode;
function getDirectiveNode(directive) {
    const { nameOrDefinition, args } = directive;
    if (nameOrDefinition === "") {
        throw new errors_1.InvalidDirectiveError("Please pass at-least one directive name or definition to the @Directive decorator");
    }
    if (!nameOrDefinition.startsWith("@")) {
        return {
            kind: "Directive",
            name: {
                kind: "Name",
                value: nameOrDefinition,
            },
            arguments: Object.keys(args).map(argKey => ({
                kind: "Argument",
                name: {
                    kind: "Name",
                    value: argKey,
                },
                value: graphql_1.parseValue(args[argKey]),
            })),
        };
    }
    let parsed;
    try {
        parsed = graphql_1.parse(`type String ${nameOrDefinition}`);
    }
    catch (err) {
        throw new errors_1.InvalidDirectiveError(`Error parsing directive definition "${directive.nameOrDefinition}"`);
    }
    const definitions = parsed.definitions;
    const directives = definitions
        .filter(it => it.directives && it.directives.length > 0)
        .map(it => it.directives)
        .reduce((acc, item) => [...acc, ...item]); // flatten the array
    if (directives.length !== 1) {
        throw new errors_1.InvalidDirectiveError(`Please pass only one directive name or definition at a time to the @Directive decorator "${directive.nameOrDefinition}"`);
    }
    return directives[0];
}
exports.getDirectiveNode = getDirectiveNode;
