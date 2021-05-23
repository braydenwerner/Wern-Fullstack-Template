"use strict";
/**
 * Created by Ivo Meißner on 28.07.17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComplexity = void 0;
const values_1 = require("graphql/execution/values");
const graphql_1 = require("graphql");
const graphql_2 = require("graphql");
function queryComplexityMessage(max, actual) {
    return (`The query exceeds the maximum complexity of ${max}. ` +
        `Actual complexity is ${actual}`);
}
function getComplexity(options) {
    const typeInfo = new graphql_1.TypeInfo(options.schema);
    const context = new graphql_1.ValidationContext(options.schema, options.query, typeInfo, () => null);
    const visitor = new QueryComplexity(context, {
        // Maximum complexity does not matter since we're only interested in the calculated complexity.
        maximumComplexity: Infinity,
        estimators: options.estimators,
        variables: options.variables,
        operationName: options.operationName
    });
    graphql_1.visit(options.query, graphql_1.visitWithTypeInfo(typeInfo, visitor));
    return visitor.complexity;
}
exports.getComplexity = getComplexity;
class QueryComplexity {
    constructor(context, options) {
        if (!(typeof options.maximumComplexity === 'number' && options.maximumComplexity > 0)) {
            throw new Error('Maximum query complexity must be a positive number');
        }
        this.context = context;
        this.complexity = 0;
        this.options = options;
        this.includeDirectiveDef = this.context.getSchema().getDirective('include');
        this.skipDirectiveDef = this.context.getSchema().getDirective('skip');
        this.estimators = options.estimators;
        this.OperationDefinition = {
            enter: this.onOperationDefinitionEnter,
            leave: this.onOperationDefinitionLeave
        };
    }
    onOperationDefinitionEnter(operation) {
        if (typeof this.options.operationName === 'string' && this.options.operationName !== operation.name.value) {
            return;
        }
        switch (operation.operation) {
            case 'query':
                this.complexity += this.nodeComplexity(operation, this.context.getSchema().getQueryType());
                break;
            case 'mutation':
                this.complexity += this.nodeComplexity(operation, this.context.getSchema().getMutationType());
                break;
            case 'subscription':
                this.complexity += this.nodeComplexity(operation, this.context.getSchema().getSubscriptionType());
                break;
            default:
                throw new Error(`Query complexity could not be calculated for operation of type ${operation.operation}`);
        }
    }
    onOperationDefinitionLeave(operation) {
        if (typeof this.options.operationName === 'string' && this.options.operationName !== operation.name.value) {
            return;
        }
        if (this.options.onComplete) {
            this.options.onComplete(this.complexity);
        }
        if (this.complexity > this.options.maximumComplexity) {
            return this.context.reportError(this.createError());
        }
    }
    nodeComplexity(node, typeDef) {
        if (node.selectionSet) {
            let fields = {};
            if (typeDef instanceof graphql_2.GraphQLObjectType || typeDef instanceof graphql_2.GraphQLInterfaceType) {
                fields = typeDef.getFields();
            }
            // Determine all possible types of the current node
            let possibleTypeNames;
            if (graphql_1.isAbstractType(typeDef)) {
                possibleTypeNames = this.context.getSchema().getPossibleTypes(typeDef).map(t => t.name);
            }
            else {
                possibleTypeNames = [typeDef.name];
            }
            // Collect complexities for all possible types individually
            const selectionSetComplexities = node.selectionSet.selections.reduce((complexities, childNode) => {
                // let nodeComplexity = 0;
                var _a;
                let includeNode = true;
                let skipNode = false;
                (_a = childNode.directives) === null || _a === void 0 ? void 0 : _a.forEach((directive) => {
                    const directiveName = directive.name.value;
                    switch (directiveName) {
                        case 'include': {
                            const values = values_1.getDirectiveValues(this.includeDirectiveDef, childNode, this.options.variables || {});
                            includeNode = values.if;
                            break;
                        }
                        case 'skip': {
                            const values = values_1.getDirectiveValues(this.skipDirectiveDef, childNode, this.options.variables || {});
                            skipNode = values.if;
                            break;
                        }
                    }
                });
                if (!includeNode || skipNode) {
                    return complexities;
                }
                switch (childNode.kind) {
                    case graphql_2.Kind.FIELD: {
                        const field = fields[childNode.name.value];
                        // Invalid field, should be caught by other validation rules
                        if (!field) {
                            break;
                        }
                        const fieldType = graphql_2.getNamedType(field.type);
                        // Get arguments
                        let args;
                        try {
                            args = values_1.getArgumentValues(field, childNode, this.options.variables || {});
                        }
                        catch (e) {
                            return this.context.reportError(e);
                        }
                        // Check if we have child complexity
                        let childComplexity = 0;
                        if (graphql_1.isCompositeType(fieldType)) {
                            childComplexity = this.nodeComplexity(childNode, fieldType);
                        }
                        // Run estimators one after another and return first valid complexity
                        // score
                        const estimatorArgs = {
                            childComplexity,
                            args,
                            field,
                            type: typeDef
                        };
                        const validScore = this.estimators.find(estimator => {
                            const tmpComplexity = estimator(estimatorArgs);
                            if (typeof tmpComplexity === 'number' && !isNaN(tmpComplexity)) {
                                complexities = addComplexities(tmpComplexity, complexities, possibleTypeNames);
                                return true;
                            }
                            return false;
                        });
                        if (!validScore) {
                            return this.context.reportError(new graphql_2.GraphQLError(`No complexity could be calculated for field ${typeDef.name}.${field.name}. ` +
                                'At least one complexity estimator has to return a complexity score.'));
                        }
                        break;
                    }
                    case graphql_2.Kind.FRAGMENT_SPREAD: {
                        const fragment = this.context.getFragment(childNode.name.value);
                        // Unknown fragment, should be caught by other validation rules
                        if (!fragment) {
                            break;
                        }
                        const fragmentType = this.context.getSchema().getType(fragment.typeCondition.name.value);
                        // Invalid fragment type, ignore. Should be caught by other validation rules
                        if (!graphql_1.isCompositeType(fragmentType)) {
                            break;
                        }
                        const nodeComplexity = this.nodeComplexity(fragment, fragmentType);
                        if (graphql_1.isAbstractType(fragmentType)) {
                            // Add fragment complexity for all possible types
                            complexities = addComplexities(nodeComplexity, complexities, this.context.getSchema().getPossibleTypes(fragmentType).map(t => t.name));
                        }
                        else {
                            // Add complexity for object type
                            complexities = addComplexities(nodeComplexity, complexities, [fragmentType.name]);
                        }
                        break;
                    }
                    case graphql_2.Kind.INLINE_FRAGMENT: {
                        let inlineFragmentType = typeDef;
                        if (childNode.typeCondition && childNode.typeCondition.name) {
                            inlineFragmentType = this.context.getSchema().getType(childNode.typeCondition.name.value);
                            if (!graphql_1.isCompositeType(inlineFragmentType)) {
                                break;
                            }
                        }
                        const nodeComplexity = this.nodeComplexity(childNode, inlineFragmentType);
                        if (graphql_1.isAbstractType(inlineFragmentType)) {
                            // Add fragment complexity for all possible types
                            complexities = addComplexities(nodeComplexity, complexities, this.context.getSchema().getPossibleTypes(inlineFragmentType).map(t => t.name));
                        }
                        else {
                            // Add complexity for object type
                            complexities = addComplexities(nodeComplexity, complexities, [inlineFragmentType.name]);
                        }
                        break;
                    }
                    default: {
                        complexities = addComplexities(this.nodeComplexity(childNode, typeDef), complexities, possibleTypeNames);
                        break;
                    }
                }
                return complexities;
            }, {});
            // Only return max complexity of all possible types
            if (!selectionSetComplexities) {
                return NaN;
            }
            return Math.max(...Object.values(selectionSetComplexities), 0);
        }
        return 0;
    }
    createError() {
        if (typeof this.options.createError === 'function') {
            return this.options.createError(this.options.maximumComplexity, this.complexity);
        }
        return new graphql_2.GraphQLError(queryComplexityMessage(this.options.maximumComplexity, this.complexity));
    }
}
exports.default = QueryComplexity;
/**
 * Adds a complexity to the complexity map for all possible types
 * @param complexity
 * @param complexityMap
 * @param possibleTypes
 */
function addComplexities(complexity, complexityMap, possibleTypes) {
    for (const type of possibleTypes) {
        if (complexityMap.hasOwnProperty(type)) {
            complexityMap[type] = complexityMap[type] + complexity;
        }
        else {
            complexityMap[type] = complexity;
        }
    }
    return complexityMap;
}
//# sourceMappingURL=QueryComplexity.js.map