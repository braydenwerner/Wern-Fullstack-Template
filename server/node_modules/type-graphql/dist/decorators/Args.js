"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Args = void 0;
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
const params_1 = require("../helpers/params");
const decorators_1 = require("../helpers/decorators");
function Args(paramTypeFnOrOptions, maybeOptions) {
    const { options, returnTypeFunc } = decorators_1.getTypeDecoratorParams(paramTypeFnOrOptions, maybeOptions);
    return (prototype, propertyKey, parameterIndex) => {
        getMetadataStorage_1.getMetadataStorage().collectHandlerParamMetadata({
            kind: "args",
            ...params_1.getParamInfo({ prototype, propertyKey, parameterIndex, returnTypeFunc, options }),
        });
    };
}
exports.Args = Args;
