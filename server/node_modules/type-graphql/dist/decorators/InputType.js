"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputType = void 0;
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
const decorators_1 = require("../helpers/decorators");
function InputType(nameOrOptions, maybeOptions) {
    const { name, options } = decorators_1.getNameDecoratorParams(nameOrOptions, maybeOptions);
    return target => {
        getMetadataStorage_1.getMetadataStorage().collectInputMetadata({
            name: name || target.name,
            target,
            description: options.description,
            isAbstract: options.isAbstract,
        });
    };
}
exports.InputType = InputType;
