"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__testing__ = exports.plugin = exports.CacheScope = void 0;
const graphql_1 = require("graphql");
var CacheScope;
(function (CacheScope) {
    CacheScope["Public"] = "PUBLIC";
    CacheScope["Private"] = "PRIVATE";
})(CacheScope = exports.CacheScope || (exports.CacheScope = {}));
exports.plugin = (options = Object.create(null)) => ({
    requestDidStart(requestContext) {
        const defaultMaxAge = options.defaultMaxAge || 0;
        const hints = new Map();
        function setOverallCachePolicyWhenUnset() {
            if (!requestContext.overallCachePolicy) {
                requestContext.overallCachePolicy = computeOverallCachePolicy(hints);
            }
        }
        return {
            executionDidStart: () => ({
                executionDidEnd: () => setOverallCachePolicyWhenUnset(),
                willResolveField({ info }) {
                    let hint = {};
                    const targetType = graphql_1.getNamedType(info.returnType);
                    if (targetType instanceof graphql_1.GraphQLObjectType ||
                        targetType instanceof graphql_1.GraphQLInterfaceType) {
                        if (targetType.astNode) {
                            hint = mergeHints(hint, cacheHintFromDirectives(targetType.astNode.directives));
                        }
                    }
                    const fieldDef = info.parentType.getFields()[info.fieldName];
                    if (fieldDef.astNode) {
                        hint = mergeHints(hint, cacheHintFromDirectives(fieldDef.astNode.directives));
                    }
                    if ((targetType instanceof graphql_1.GraphQLObjectType ||
                        targetType instanceof graphql_1.GraphQLInterfaceType ||
                        !info.path.prev) &&
                        hint.maxAge === undefined) {
                        hint.maxAge = defaultMaxAge;
                    }
                    if (hint.maxAge !== undefined || hint.scope !== undefined) {
                        addHint(hints, info.path, hint);
                    }
                    info.cacheControl = {
                        setCacheHint: (hint) => {
                            addHint(hints, info.path, hint);
                        },
                        cacheHint: hint,
                    };
                },
            }),
            responseForOperation() {
                setOverallCachePolicyWhenUnset();
                return null;
            },
            willSendResponse(requestContext) {
                const { response, overallCachePolicy: overallCachePolicyOverride, } = requestContext;
                if (response.errors) {
                    return;
                }
                const overallCachePolicy = overallCachePolicyOverride ||
                    (requestContext.overallCachePolicy =
                        computeOverallCachePolicy(hints));
                if (overallCachePolicy &&
                    options.calculateHttpHeaders &&
                    response.http) {
                    response.http.headers.set('Cache-Control', `max-age=${overallCachePolicy.maxAge}, ${overallCachePolicy.scope.toLowerCase()}`);
                }
                if (options.stripFormattedExtensions !== false)
                    return;
                const extensions = response.extensions || (response.extensions = Object.create(null));
                if (typeof extensions.cacheControl !== 'undefined') {
                    throw new Error("The cacheControl information already existed.");
                }
                extensions.cacheControl = {
                    version: 1,
                    hints: Array.from(hints).map(([path, hint]) => (Object.assign({ path: [...graphql_1.responsePathAsArray(path)] }, hint))),
                };
            }
        };
    }
});
function cacheHintFromDirectives(directives) {
    if (!directives)
        return undefined;
    const cacheControlDirective = directives.find(directive => directive.name.value === 'cacheControl');
    if (!cacheControlDirective)
        return undefined;
    if (!cacheControlDirective.arguments)
        return undefined;
    const maxAgeArgument = cacheControlDirective.arguments.find(argument => argument.name.value === 'maxAge');
    const scopeArgument = cacheControlDirective.arguments.find(argument => argument.name.value === 'scope');
    return {
        maxAge: maxAgeArgument &&
            maxAgeArgument.value &&
            maxAgeArgument.value.kind === 'IntValue'
            ? parseInt(maxAgeArgument.value.value)
            : undefined,
        scope: scopeArgument &&
            scopeArgument.value &&
            scopeArgument.value.kind === 'EnumValue'
            ? scopeArgument.value.value
            : undefined,
    };
}
function mergeHints(hint, otherHint) {
    if (!otherHint)
        return hint;
    return {
        maxAge: otherHint.maxAge !== undefined ? otherHint.maxAge : hint.maxAge,
        scope: otherHint.scope || hint.scope,
    };
}
function computeOverallCachePolicy(hints) {
    let lowestMaxAge = undefined;
    let scope = CacheScope.Public;
    for (const hint of hints.values()) {
        if (hint.maxAge !== undefined) {
            lowestMaxAge =
                lowestMaxAge !== undefined
                    ? Math.min(lowestMaxAge, hint.maxAge)
                    : hint.maxAge;
        }
        if (hint.scope === CacheScope.Private) {
            scope = CacheScope.Private;
        }
    }
    return lowestMaxAge
        ? {
            maxAge: lowestMaxAge,
            scope,
        }
        : undefined;
}
function addHint(hints, path, hint) {
    const existingCacheHint = hints.get(path);
    if (existingCacheHint) {
        hints.set(path, mergeHints(existingCacheHint, hint));
    }
    else {
        hints.set(path, hint);
    }
}
exports.__testing__ = {
    addHint,
    computeOverallCachePolicy,
};
//# sourceMappingURL=index.js.map