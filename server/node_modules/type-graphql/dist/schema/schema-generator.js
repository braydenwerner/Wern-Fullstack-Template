"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaGenerator = void 0;
const graphql_1 = require("graphql");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
const types_1 = require("../helpers/types");
const create_1 = require("../resolvers/create");
const build_context_1 = require("./build-context");
const errors_1 = require("../errors");
const utils_1 = require("./utils");
const graphql_version_1 = require("../utils/graphql-version");
const definition_node_1 = require("./definition-node");
class SchemaGenerator {
    static async generateFromMetadata(options) {
        const schema = this.generateFromMetadataSync(options);
        if (!options.skipCheck) {
            const { errors } = await graphql_1.graphql(schema, graphql_1.getIntrospectionQuery());
            if (errors) {
                throw new errors_1.GeneratingSchemaError(errors);
            }
        }
        return schema;
    }
    static generateFromMetadataSync(options) {
        this.checkForErrors(options);
        build_context_1.BuildContext.create(options);
        getMetadataStorage_1.getMetadataStorage().build(options);
        this.buildTypesInfo(options.resolvers);
        const orphanedTypes = options.orphanedTypes || (options.resolvers ? [] : undefined);
        const prebuiltSchema = new graphql_1.GraphQLSchema({
            query: this.buildRootQueryType(options.resolvers),
            mutation: this.buildRootMutationType(options.resolvers),
            subscription: this.buildRootSubscriptionType(options.resolvers),
            directives: options.directives,
        });
        const finalSchema = new graphql_1.GraphQLSchema({
            ...prebuiltSchema.toConfig(),
            // run after first build to make `usedInterfaceTypes` working
            types: this.buildOtherTypes(orphanedTypes),
        });
        build_context_1.BuildContext.reset();
        this.usedInterfaceTypes = new Set();
        return finalSchema;
    }
    static checkForErrors(options) {
        graphql_version_1.ensureInstalledCorrectGraphQLPackage();
        if (getMetadataStorage_1.getMetadataStorage().authorizedFields.length !== 0 && options.authChecker === undefined) {
            throw new Error("You need to provide `authChecker` function for `@Authorized` decorator usage!");
        }
    }
    static getDefaultValue(typeInstance, typeOptions, fieldName, typeName) {
        const defaultValueFromInitializer = typeInstance[fieldName];
        if (typeOptions.defaultValue !== undefined &&
            defaultValueFromInitializer !== undefined &&
            typeOptions.defaultValue !== defaultValueFromInitializer) {
            throw new errors_1.ConflictingDefaultValuesError(typeName, fieldName, typeOptions.defaultValue, defaultValueFromInitializer);
        }
        return typeOptions.defaultValue !== undefined
            ? typeOptions.defaultValue
            : defaultValueFromInitializer;
    }
    static buildTypesInfo(resolvers) {
        this.unionTypesInfo = getMetadataStorage_1.getMetadataStorage().unions.map(unionMetadata => {
            // use closure to capture values from this selected schema build
            const unionObjectTypesInfo = [];
            // called once after building all `objectTypesInfo`
            const typesThunk = () => {
                unionObjectTypesInfo.push(...unionMetadata
                    .getClassTypes()
                    .map(objectTypeCls => this.objectTypesInfo.find(type => type.target === objectTypeCls)));
                return unionObjectTypesInfo.map(it => it.type);
            };
            return {
                unionSymbol: unionMetadata.symbol,
                type: new graphql_1.GraphQLUnionType({
                    name: unionMetadata.name,
                    description: unionMetadata.description,
                    types: typesThunk,
                    resolveType: unionMetadata.resolveType
                        ? this.getResolveTypeFunction(unionMetadata.resolveType, 
                        // use closure captured `unionObjectTypesInfo`
                        unionObjectTypesInfo)
                        : instance => {
                            const instanceTarget = unionMetadata
                                .getClassTypes()
                                .find(ObjectClassType => instance instanceof ObjectClassType);
                            if (!instanceTarget) {
                                throw new errors_1.UnionResolveTypeError(unionMetadata);
                            }
                            // use closure captured `unionObjectTypesInfo`
                            const objectTypeInfo = unionObjectTypesInfo.find(type => type.target === instanceTarget);
                            return objectTypeInfo.type;
                        },
                }),
            };
        });
        this.enumTypesInfo = getMetadataStorage_1.getMetadataStorage().enums.map(enumMetadata => {
            const enumMap = types_1.getEnumValuesMap(enumMetadata.enumObj);
            return {
                enumObj: enumMetadata.enumObj,
                type: new graphql_1.GraphQLEnumType({
                    name: enumMetadata.name,
                    description: enumMetadata.description,
                    values: Object.keys(enumMap).reduce((enumConfig, enumKey) => {
                        const valueConfig = enumMetadata.valuesConfig[enumKey] || {};
                        enumConfig[enumKey] = {
                            value: enumMap[enumKey],
                            description: valueConfig.description,
                            deprecationReason: valueConfig.deprecationReason,
                        };
                        return enumConfig;
                    }, {}),
                }),
            };
        });
        this.objectTypesInfo = getMetadataStorage_1.getMetadataStorage().objectTypes.map(objectType => {
            const objectSuperClass = Object.getPrototypeOf(objectType.target);
            const hasExtended = objectSuperClass.prototype !== undefined;
            const getSuperClassType = () => {
                const superClassTypeInfo = this.objectTypesInfo.find(type => type.target === objectSuperClass);
                return superClassTypeInfo ? superClassTypeInfo.type : undefined;
            };
            const interfaceClasses = objectType.interfaceClasses || [];
            return {
                metadata: objectType,
                target: objectType.target,
                isAbstract: objectType.isAbstract || false,
                type: new graphql_1.GraphQLObjectType({
                    name: objectType.name,
                    description: objectType.description,
                    astNode: definition_node_1.getObjectTypeDefinitionNode(objectType.name, objectType.directives),
                    extensions: objectType.extensions,
                    interfaces: () => {
                        let interfaces = interfaceClasses.map(interfaceClass => {
                            const interfaceTypeInfo = this.interfaceTypesInfo.find(info => info.target === interfaceClass);
                            if (!interfaceTypeInfo) {
                                throw new Error(`Cannot find interface type metadata for class '${interfaceClass.name}' ` +
                                    `provided in 'implements' option for '${objectType.target.name}' object type class. ` +
                                    `Please make sure that class is annotated with an '@InterfaceType()' decorator.`);
                            }
                            return interfaceTypeInfo.type;
                        });
                        // copy interfaces from super class
                        if (hasExtended) {
                            const superClass = getSuperClassType();
                            if (superClass) {
                                const superInterfaces = superClass.getInterfaces();
                                interfaces = Array.from(new Set(interfaces.concat(superInterfaces)));
                            }
                        }
                        return interfaces;
                    },
                    fields: () => {
                        const fieldsMetadata = [];
                        // support for implicitly implementing interfaces
                        // get fields from interfaces definitions
                        if (objectType.interfaceClasses) {
                            const implementedInterfaces = getMetadataStorage_1.getMetadataStorage().interfaceTypes.filter(it => objectType.interfaceClasses.includes(it.target));
                            implementedInterfaces.forEach(it => {
                                fieldsMetadata.push(...(it.fields || []));
                            });
                        }
                        // push own fields at the end to overwrite the one inherited from interface
                        fieldsMetadata.push(...objectType.fields);
                        let fields = fieldsMetadata.reduce((fieldsMap, field) => {
                            const fieldResolvers = getMetadataStorage_1.getMetadataStorage().fieldResolvers;
                            const filteredFieldResolversMetadata = !resolvers
                                ? fieldResolvers
                                : fieldResolvers.filter(it => it.kind === "internal" || resolvers.includes(it.target));
                            const fieldResolverMetadata = filteredFieldResolversMetadata.find(it => it.getObjectType() === field.target &&
                                it.methodName === field.name &&
                                (it.resolverClassMetadata === undefined ||
                                    it.resolverClassMetadata.isAbstract === false));
                            const type = this.getGraphQLOutputType(field.target, field.name, field.getType(), field.typeOptions);
                            const isSimpleResolver = field.simple !== undefined
                                ? field.simple === true
                                : objectType.simpleResolvers !== undefined
                                    ? objectType.simpleResolvers === true
                                    : false;
                            fieldsMap[field.schemaName] = {
                                type,
                                args: this.generateHandlerArgs(field.target, field.name, field.params),
                                resolve: fieldResolverMetadata
                                    ? create_1.createAdvancedFieldResolver(fieldResolverMetadata)
                                    : isSimpleResolver
                                        ? undefined
                                        : create_1.createBasicFieldResolver(field),
                                description: field.description,
                                deprecationReason: field.deprecationReason,
                                astNode: definition_node_1.getFieldDefinitionNode(field.name, type, field.directives),
                                extensions: {
                                    complexity: field.complexity,
                                    ...field.extensions,
                                },
                            };
                            return fieldsMap;
                        }, {});
                        // support for extending classes - get field info from prototype
                        if (hasExtended) {
                            const superClass = getSuperClassType();
                            if (superClass) {
                                const superClassFields = utils_1.getFieldMetadataFromObjectType(superClass);
                                fields = Object.assign({}, superClassFields, fields);
                            }
                        }
                        return fields;
                    },
                }),
            };
        });
        this.interfaceTypesInfo = getMetadataStorage_1.getMetadataStorage().interfaceTypes.map(interfaceType => {
            const interfaceSuperClass = Object.getPrototypeOf(interfaceType.target);
            const hasExtended = interfaceSuperClass.prototype !== undefined;
            const getSuperClassType = () => {
                const superClassTypeInfo = this.interfaceTypesInfo.find(type => type.target === interfaceSuperClass);
                return superClassTypeInfo ? superClassTypeInfo.type : undefined;
            };
            // fetch ahead the subset of object types that implements this interface
            const implementingObjectTypesTargets = getMetadataStorage_1.getMetadataStorage()
                .objectTypes.filter(objectType => objectType.interfaceClasses &&
                objectType.interfaceClasses.includes(interfaceType.target))
                .map(objectType => objectType.target);
            const implementingObjectTypesInfo = this.objectTypesInfo.filter(objectTypesInfo => implementingObjectTypesTargets.includes(objectTypesInfo.target));
            return {
                metadata: interfaceType,
                target: interfaceType.target,
                isAbstract: interfaceType.isAbstract || false,
                type: new graphql_1.GraphQLInterfaceType({
                    name: interfaceType.name,
                    description: interfaceType.description,
                    interfaces: () => {
                        let interfaces = (interfaceType.interfaceClasses || []).map(interfaceClass => this.interfaceTypesInfo.find(info => info.target === interfaceClass).type);
                        // copy interfaces from super class
                        if (hasExtended) {
                            const superClass = getSuperClassType();
                            if (superClass) {
                                const superInterfaces = superClass.getInterfaces();
                                interfaces = Array.from(new Set(interfaces.concat(superInterfaces)));
                            }
                        }
                        return interfaces;
                    },
                    fields: () => {
                        const fieldsMetadata = [];
                        // support for implicitly implementing interfaces
                        // get fields from interfaces definitions
                        if (interfaceType.interfaceClasses) {
                            const implementedInterfacesMetadata = getMetadataStorage_1.getMetadataStorage().interfaceTypes.filter(it => interfaceType.interfaceClasses.includes(it.target));
                            implementedInterfacesMetadata.forEach(it => {
                                fieldsMetadata.push(...(it.fields || []));
                            });
                        }
                        // push own fields at the end to overwrite the one inherited from interface
                        fieldsMetadata.push(...interfaceType.fields);
                        let fields = fieldsMetadata.reduce((fieldsMap, field) => {
                            const fieldResolverMetadata = getMetadataStorage_1.getMetadataStorage().fieldResolvers.find(resolver => resolver.getObjectType() === field.target &&
                                resolver.methodName === field.name &&
                                (resolver.resolverClassMetadata === undefined ||
                                    resolver.resolverClassMetadata.isAbstract === false));
                            fieldsMap[field.schemaName] = {
                                type: this.getGraphQLOutputType(field.target, field.name, field.getType(), field.typeOptions),
                                args: this.generateHandlerArgs(field.target, field.name, field.params),
                                resolve: fieldResolverMetadata
                                    ? create_1.createAdvancedFieldResolver(fieldResolverMetadata)
                                    : create_1.createBasicFieldResolver(field),
                                description: field.description,
                                deprecationReason: field.deprecationReason,
                                extensions: {
                                    complexity: field.complexity,
                                    ...field.extensions,
                                },
                            };
                            return fieldsMap;
                        }, {});
                        // support for extending interface classes - get field info from prototype
                        if (hasExtended) {
                            const superClass = getSuperClassType();
                            if (superClass) {
                                const superClassFields = utils_1.getFieldMetadataFromObjectType(superClass);
                                fields = Object.assign({}, superClassFields, fields);
                            }
                        }
                        return fields;
                    },
                    resolveType: interfaceType.resolveType
                        ? this.getResolveTypeFunction(interfaceType.resolveType, implementingObjectTypesInfo)
                        : instance => {
                            const typeTarget = implementingObjectTypesTargets.find(typeCls => instance instanceof typeCls);
                            if (!typeTarget) {
                                throw new errors_1.InterfaceResolveTypeError(interfaceType);
                            }
                            const objectTypeInfo = implementingObjectTypesInfo.find(type => type.target === typeTarget);
                            return objectTypeInfo.type;
                        },
                }),
            };
        });
        this.inputTypesInfo = getMetadataStorage_1.getMetadataStorage().inputTypes.map(inputType => {
            const objectSuperClass = Object.getPrototypeOf(inputType.target);
            const getSuperClassType = () => {
                const superClassTypeInfo = this.inputTypesInfo.find(type => type.target === objectSuperClass);
                return superClassTypeInfo ? superClassTypeInfo.type : undefined;
            };
            const inputInstance = new inputType.target();
            return {
                target: inputType.target,
                isAbstract: inputType.isAbstract || false,
                type: new graphql_1.GraphQLInputObjectType({
                    name: inputType.name,
                    description: inputType.description,
                    extensions: inputType.extensions,
                    fields: () => {
                        let fields = inputType.fields.reduce((fieldsMap, field) => {
                            field.typeOptions.defaultValue = this.getDefaultValue(inputInstance, field.typeOptions, field.name, inputType.name);
                            const type = this.getGraphQLInputType(field.target, field.name, field.getType(), field.typeOptions);
                            fieldsMap[field.schemaName] = {
                                description: field.description,
                                type,
                                defaultValue: field.typeOptions.defaultValue,
                                astNode: definition_node_1.getInputValueDefinitionNode(field.name, type, field.directives),
                                extensions: field.extensions,
                            };
                            return fieldsMap;
                        }, {});
                        // support for extending classes - get field info from prototype
                        if (objectSuperClass.prototype !== undefined) {
                            const superClass = getSuperClassType();
                            if (superClass) {
                                const superClassFields = utils_1.getFieldMetadataFromInputType(superClass);
                                fields = Object.assign({}, superClassFields, fields);
                            }
                        }
                        return fields;
                    },
                    astNode: definition_node_1.getInputObjectTypeDefinitionNode(inputType.name, inputType.directives),
                }),
            };
        });
    }
    static buildRootQueryType(resolvers) {
        const queriesHandlers = this.filterHandlersByResolvers(getMetadataStorage_1.getMetadataStorage().queries, resolvers);
        return new graphql_1.GraphQLObjectType({
            name: "Query",
            fields: this.generateHandlerFields(queriesHandlers),
        });
    }
    static buildRootMutationType(resolvers) {
        const mutationsHandlers = this.filterHandlersByResolvers(getMetadataStorage_1.getMetadataStorage().mutations, resolvers);
        if (mutationsHandlers.length === 0) {
            return;
        }
        return new graphql_1.GraphQLObjectType({
            name: "Mutation",
            fields: this.generateHandlerFields(mutationsHandlers),
        });
    }
    static buildRootSubscriptionType(resolvers) {
        const subscriptionsHandlers = this.filterHandlersByResolvers(getMetadataStorage_1.getMetadataStorage().subscriptions, resolvers);
        if (subscriptionsHandlers.length === 0) {
            return;
        }
        return new graphql_1.GraphQLObjectType({
            name: "Subscription",
            fields: this.generateSubscriptionsFields(subscriptionsHandlers),
        });
    }
    static buildOtherTypes(orphanedTypes) {
        const autoRegisteredObjectTypesInfo = this.objectTypesInfo.filter(typeInfo => { var _a; return (_a = typeInfo.metadata.interfaceClasses) === null || _a === void 0 ? void 0 : _a.some(interfaceClass => {
            const implementedInterfaceInfo = this.interfaceTypesInfo.find(it => it.target === interfaceClass);
            if (!implementedInterfaceInfo) {
                return false;
            }
            if (implementedInterfaceInfo.metadata.autoRegisteringDisabled) {
                return false;
            }
            if (!this.usedInterfaceTypes.has(interfaceClass)) {
                return false;
            }
            return true;
        }); });
        return [
            ...this.filterTypesInfoByIsAbstractAndOrphanedTypesAndExtractType(this.objectTypesInfo, orphanedTypes),
            ...this.filterTypesInfoByIsAbstractAndOrphanedTypesAndExtractType(this.interfaceTypesInfo, orphanedTypes),
            ...this.filterTypesInfoByIsAbstractAndOrphanedTypesAndExtractType(this.inputTypesInfo, orphanedTypes),
            ...autoRegisteredObjectTypesInfo.map(typeInfo => typeInfo.type),
        ];
    }
    static generateHandlerFields(handlers) {
        return handlers.reduce((fields, handler) => {
            // omit emitting abstract resolver fields
            if (handler.resolverClassMetadata && handler.resolverClassMetadata.isAbstract) {
                return fields;
            }
            const type = this.getGraphQLOutputType(handler.target, handler.methodName, handler.getReturnType(), handler.returnTypeOptions);
            fields[handler.schemaName] = {
                type,
                args: this.generateHandlerArgs(handler.target, handler.methodName, handler.params),
                resolve: create_1.createHandlerResolver(handler),
                description: handler.description,
                deprecationReason: handler.deprecationReason,
                astNode: definition_node_1.getFieldDefinitionNode(handler.schemaName, type, handler.directives),
                extensions: {
                    complexity: handler.complexity,
                    ...handler.extensions,
                },
            };
            return fields;
        }, {});
    }
    static generateSubscriptionsFields(subscriptionsHandlers) {
        const { pubSub } = build_context_1.BuildContext;
        const basicFields = this.generateHandlerFields(subscriptionsHandlers);
        return subscriptionsHandlers.reduce((fields, handler) => {
            // omit emitting abstract resolver fields
            if (handler.resolverClassMetadata && handler.resolverClassMetadata.isAbstract) {
                return fields;
            }
            let subscribeFn;
            if (handler.subscribe) {
                subscribeFn = handler.subscribe;
            }
            else {
                let pubSubIterator;
                if (typeof handler.topics === "function") {
                    const getTopics = handler.topics;
                    pubSubIterator = (payload, args, context, info) => {
                        const resolverTopicData = { payload, args, context, info };
                        const topics = getTopics(resolverTopicData);
                        if (Array.isArray(topics) && topics.length === 0) {
                            throw new errors_1.MissingSubscriptionTopicsError(handler.target, handler.methodName);
                        }
                        return pubSub.asyncIterator(topics);
                    };
                }
                else {
                    const topics = handler.topics;
                    pubSubIterator = () => pubSub.asyncIterator(topics);
                }
                subscribeFn = handler.filter
                    ? graphql_subscriptions_1.withFilter(pubSubIterator, (payload, args, context, info) => {
                        const resolverFilterData = { payload, args, context, info };
                        return handler.filter(resolverFilterData);
                    })
                    : pubSubIterator;
            }
            fields[handler.schemaName].subscribe = create_1.wrapResolverWithAuthChecker(subscribeFn, handler.roles);
            return fields;
        }, basicFields);
    }
    static generateHandlerArgs(target, propertyName, params) {
        return params.reduce((args, param) => {
            if (param.kind === "arg") {
                args[param.name] = {
                    description: param.description,
                    type: this.getGraphQLInputType(target, propertyName, param.getType(), param.typeOptions, param.index, param.name),
                    defaultValue: param.typeOptions.defaultValue,
                };
            }
            else if (param.kind === "args") {
                const argumentType = getMetadataStorage_1.getMetadataStorage().argumentTypes.find(it => it.target === param.getType());
                if (!argumentType) {
                    throw new Error(`The value used as a type of '@Args' for '${propertyName}' of '${target.name}' ` +
                        `is not a class decorated with '@ArgsType' decorator!`);
                }
                let superClass = Object.getPrototypeOf(argumentType.target);
                while (superClass.prototype !== undefined) {
                    const superArgumentType = getMetadataStorage_1.getMetadataStorage().argumentTypes.find(it => it.target === superClass);
                    if (superArgumentType) {
                        this.mapArgFields(superArgumentType, args);
                    }
                    superClass = Object.getPrototypeOf(superClass);
                }
                this.mapArgFields(argumentType, args);
            }
            return args;
        }, {});
    }
    static mapArgFields(argumentType, args = {}) {
        const argumentInstance = new argumentType.target();
        argumentType.fields.forEach(field => {
            field.typeOptions.defaultValue = this.getDefaultValue(argumentInstance, field.typeOptions, field.name, argumentType.name);
            args[field.schemaName] = {
                description: field.description,
                type: this.getGraphQLInputType(field.target, field.name, field.getType(), field.typeOptions),
                defaultValue: field.typeOptions.defaultValue,
            };
        });
    }
    static getGraphQLOutputType(target, propertyName, type, typeOptions = {}) {
        let gqlType;
        gqlType = types_1.convertTypeIfScalar(type);
        if (!gqlType) {
            const objectType = this.objectTypesInfo.find(it => it.target === type);
            if (objectType) {
                gqlType = objectType.type;
            }
        }
        if (!gqlType) {
            const interfaceType = this.interfaceTypesInfo.find(it => it.target === type);
            if (interfaceType) {
                this.usedInterfaceTypes.add(interfaceType.target);
                gqlType = interfaceType.type;
            }
        }
        if (!gqlType) {
            const enumType = this.enumTypesInfo.find(it => it.enumObj === type);
            if (enumType) {
                gqlType = enumType.type;
            }
        }
        if (!gqlType) {
            const unionType = this.unionTypesInfo.find(it => it.unionSymbol === type);
            if (unionType) {
                gqlType = unionType.type;
            }
        }
        if (!gqlType) {
            throw new errors_1.CannotDetermineGraphQLTypeError("output", target.name, propertyName);
        }
        const { nullableByDefault } = build_context_1.BuildContext;
        return types_1.wrapWithTypeOptions(target, propertyName, gqlType, typeOptions, nullableByDefault);
    }
    static getGraphQLInputType(target, propertyName, type, typeOptions = {}, parameterIndex, argName) {
        let gqlType;
        gqlType = types_1.convertTypeIfScalar(type);
        if (!gqlType) {
            const inputType = this.inputTypesInfo.find(it => it.target === type);
            if (inputType) {
                gqlType = inputType.type;
            }
        }
        if (!gqlType) {
            const enumType = this.enumTypesInfo.find(it => it.enumObj === type);
            if (enumType) {
                gqlType = enumType.type;
            }
        }
        if (!gqlType) {
            throw new errors_1.CannotDetermineGraphQLTypeError("input", target.name, propertyName, parameterIndex, argName);
        }
        const { nullableByDefault } = build_context_1.BuildContext;
        return types_1.wrapWithTypeOptions(target, propertyName, gqlType, typeOptions, nullableByDefault);
    }
    static getResolveTypeFunction(resolveType, possibleObjectTypesInfo) {
        return async (...args) => {
            var _a;
            const resolvedType = await resolveType(...args);
            if (!resolvedType || typeof resolvedType === "string") {
                return resolvedType;
            }
            return (_a = possibleObjectTypesInfo.find(objectType => objectType.target === resolvedType)) === null || _a === void 0 ? void 0 : _a.type;
        };
    }
    static filterHandlersByResolvers(handlers, resolvers) {
        return resolvers ? handlers.filter(query => resolvers.includes(query.target)) : handlers;
    }
    static filterTypesInfoByIsAbstractAndOrphanedTypesAndExtractType(typesInfo, orphanedTypes) {
        return typesInfo
            .filter(it => !it.isAbstract && (!orphanedTypes || orphanedTypes.includes(it.target)))
            .map(it => it.type);
    }
}
exports.SchemaGenerator = SchemaGenerator;
SchemaGenerator.objectTypesInfo = [];
SchemaGenerator.inputTypesInfo = [];
SchemaGenerator.interfaceTypesInfo = [];
SchemaGenerator.enumTypesInfo = [];
SchemaGenerator.unionTypesInfo = [];
SchemaGenerator.usedInterfaceTypes = new Set();
