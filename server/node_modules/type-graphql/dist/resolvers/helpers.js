"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMiddlewares = exports.applyAuthChecker = exports.getParams = void 0;
const types_1 = require("../helpers/types");
const validate_arg_1 = require("./validate-arg");
const auth_middleware_1 = require("../helpers/auth-middleware");
const convert_args_1 = require("./convert-args");
const isPromiseLike_1 = require("../utils/isPromiseLike");
function getParams(params, resolverData, globalValidate, pubSub) {
    const paramValues = params
        .sort((a, b) => a.index - b.index)
        .map(paramInfo => {
        switch (paramInfo.kind) {
            case "args":
                return validate_arg_1.validateArg(convert_args_1.convertArgsToInstance(paramInfo, resolverData.args), paramInfo.getType(), globalValidate, paramInfo.validate);
            case "arg":
                return validate_arg_1.validateArg(convert_args_1.convertArgToInstance(paramInfo, resolverData.args), paramInfo.getType(), globalValidate, paramInfo.validate);
            case "context":
                if (paramInfo.propertyName) {
                    return resolverData.context[paramInfo.propertyName];
                }
                return resolverData.context;
            case "root":
                const rootValue = paramInfo.propertyName
                    ? resolverData.root[paramInfo.propertyName]
                    : resolverData.root;
                if (!paramInfo.getType) {
                    return rootValue;
                }
                return types_1.convertToType(paramInfo.getType(), rootValue);
            case "info":
                return resolverData.info;
            case "pubSub":
                if (paramInfo.triggerKey) {
                    return (payload) => pubSub.publish(paramInfo.triggerKey, payload);
                }
                return pubSub;
            case "custom":
                return paramInfo.resolver(resolverData);
        }
    });
    if (paramValues.some(isPromiseLike_1.default)) {
        return Promise.all(paramValues);
    }
    else {
        return paramValues;
    }
}
exports.getParams = getParams;
function applyAuthChecker(middlewares, authMode, authChecker, roles) {
    if (authChecker && roles) {
        middlewares.unshift(auth_middleware_1.AuthMiddleware(authChecker, authMode, roles));
    }
}
exports.applyAuthChecker = applyAuthChecker;
function applyMiddlewares(container, resolverData, middlewares, resolverHandlerFunction) {
    if (middlewares.length === 0) {
        return resolverHandlerFunction();
    }
    let middlewaresIndex = -1;
    async function dispatchHandler(currentIndex) {
        if (currentIndex <= middlewaresIndex) {
            throw new Error("next() called multiple times");
        }
        middlewaresIndex = currentIndex;
        let handlerFn;
        if (currentIndex === middlewares.length) {
            handlerFn = resolverHandlerFunction;
        }
        else {
            const currentMiddleware = middlewares[currentIndex];
            // arrow function or class
            if (currentMiddleware.prototype !== undefined) {
                const middlewareClassInstance = await container.getInstance(currentMiddleware, resolverData);
                handlerFn = middlewareClassInstance.use.bind(middlewareClassInstance);
            }
            else {
                handlerFn = currentMiddleware;
            }
        }
        let nextResult;
        const result = await handlerFn(resolverData, async () => {
            nextResult = await dispatchHandler(currentIndex + 1);
            return nextResult;
        });
        return result !== undefined ? result : nextResult;
    }
    return dispatchHandler(0);
}
exports.applyMiddlewares = applyMiddlewares;
