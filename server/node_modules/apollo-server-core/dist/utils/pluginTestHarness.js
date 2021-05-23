"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("graphql/type");
const schemaInstrumentation_1 = require("./schemaInstrumentation");
const apollo_server_caching_1 = require("apollo-server-caching");
const dispatcher_1 = require("./dispatcher");
const schemaHash_1 = require("./schemaHash");
const graphql_1 = require("graphql");
function pluginTestHarness({ pluginInstance, schema, logger, graphqlRequest, overallCachePolicy, executor, context = Object.create(null) }) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!schema) {
            schema = new type_1.GraphQLSchema({
                query: new type_1.GraphQLObjectType({
                    name: 'RootQueryType',
                    fields: {
                        hello: {
                            type: type_1.GraphQLString,
                            resolve() {
                                return 'hello world';
                            }
                        }
                    }
                })
            });
        }
        const schemaHash = schemaHash_1.generateSchemaHash(schema);
        let serverListener;
        if (typeof pluginInstance.serverWillStart === 'function') {
            const maybeServerListener = yield pluginInstance.serverWillStart({
                logger: logger || console,
                schema,
                schemaHash,
                serverlessFramework: false,
                apollo: {
                    key: 'some-key',
                    graphId: 'graph',
                    graphVariant: 'current',
                },
                engine: {},
            });
            if (maybeServerListener && maybeServerListener.serverWillStop) {
                serverListener = maybeServerListener;
            }
        }
        const requestContext = {
            logger: logger || console,
            schema,
            schemaHash: schemaHash_1.generateSchemaHash(schema),
            request: graphqlRequest,
            metrics: Object.create(null),
            source: graphqlRequest.query,
            cache: new apollo_server_caching_1.InMemoryLRUCache(),
            context,
        };
        if (requestContext.source === undefined) {
            throw new Error("No source provided for test");
        }
        requestContext.overallCachePolicy = overallCachePolicy;
        if (typeof pluginInstance.requestDidStart !== "function") {
            throw new Error("This test harness expects this to be defined.");
        }
        const listener = pluginInstance.requestDidStart(requestContext);
        const dispatcher = new dispatcher_1.Dispatcher(listener ? [listener] : []);
        const executionListeners = [];
        yield dispatcher.invokeHookAsync('didResolveSource', requestContext);
        if (!requestContext.document) {
            yield dispatcher.invokeDidStartHook('parsingDidStart', requestContext);
            try {
                requestContext.document = graphql_1.parse(requestContext.source, undefined);
            }
            catch (syntaxError) {
                const errorOrErrors = syntaxError;
                requestContext.errors = Array.isArray(errorOrErrors)
                    ? errorOrErrors
                    : [errorOrErrors];
                yield dispatcher.invokeHookAsync('didEncounterErrors', requestContext);
                return requestContext;
            }
            const validationDidEnd = yield dispatcher.invokeDidStartHook('validationDidStart', requestContext);
            const validationErrors = graphql_1.validate(requestContext.schema, requestContext.document);
            if (validationErrors.length !== 0) {
                requestContext.errors = validationErrors;
                validationDidEnd(validationErrors);
                yield dispatcher.invokeHookAsync('didEncounterErrors', requestContext);
                return requestContext;
            }
            else {
                validationDidEnd();
            }
        }
        const operation = graphql_1.getOperationAST(requestContext.document, requestContext.request.operationName);
        requestContext.operation = operation || undefined;
        requestContext.operationName =
            (operation && operation.name && operation.name.value) || null;
        yield dispatcher.invokeHookAsync('didResolveOperation', requestContext);
        dispatcher.invokeHookSync('executionDidStart', requestContext).forEach(executionListener => {
            if (typeof executionListener === 'function') {
                executionListeners.push({
                    executionDidEnd: executionListener,
                });
            }
            else if (typeof executionListener === 'object') {
                executionListeners.push(executionListener);
            }
        });
        const executionDispatcher = new dispatcher_1.Dispatcher(executionListeners);
        const invokeWillResolveField = (...args) => executionDispatcher.invokeDidStartHook('willResolveField', ...args);
        Object.defineProperty(requestContext.context, schemaInstrumentation_1.symbolExecutionDispatcherWillResolveField, { value: invokeWillResolveField });
        schemaInstrumentation_1.enablePluginsForSchemaResolvers(schema);
        try {
            requestContext.response = yield executor(requestContext);
            executionDispatcher.reverseInvokeHookSync("executionDidEnd");
        }
        catch (executionErr) {
            executionDispatcher.reverseInvokeHookSync("executionDidEnd", executionErr);
        }
        yield dispatcher.invokeHookAsync("willSendResponse", requestContext);
        yield ((_a = serverListener === null || serverListener === void 0 ? void 0 : serverListener.serverWillStop) === null || _a === void 0 ? void 0 : _a.call(serverListener));
        return requestContext;
    });
}
exports.default = pluginTestHarness;
//# sourceMappingURL=pluginTestHarness.js.map