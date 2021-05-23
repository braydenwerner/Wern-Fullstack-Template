"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arg = void 0;
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
const params_1 = require("../helpers/params");
const decorators_1 = require("../helpers/decorators");
function Arg(name, returnTypeFuncOrOptions, maybeOptions) {
    return (prototype, propertyKey, parameterIndex) => {
        const { options, returnTypeFunc } = decorators_1.getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
        getMetadataStorage_1.getMetadataStorage().collectHandlerParamMetadata({
            kind: "arg",
            name,
            description: options.description,
            ...params_1.getParamInfo({
                prototype,
                propertyKey,
                parameterIndex,
                returnTypeFunc,
                options,
                argName: name,
            }),
        });
    };
}
exports.Arg = Arg;
