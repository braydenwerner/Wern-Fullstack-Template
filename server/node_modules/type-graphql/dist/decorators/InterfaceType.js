"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceType = void 0;
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
const decorators_1 = require("../helpers/decorators");
function InterfaceType(nameOrOptions, maybeOptions) {
    const { name, options } = decorators_1.getNameDecoratorParams(nameOrOptions, maybeOptions);
    const interfaceClasses = options.implements && [].concat(options.implements);
    return target => {
        getMetadataStorage_1.getMetadataStorage().collectInterfaceMetadata({
            name: name || target.name,
            target,
            interfaceClasses,
            autoRegisteringDisabled: options.autoRegisterImplementations === false,
            ...options,
        });
    };
}
exports.InterfaceType = InterfaceType;
