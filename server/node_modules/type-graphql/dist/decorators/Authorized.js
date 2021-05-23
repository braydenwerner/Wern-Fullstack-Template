"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authorized = void 0;
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
const errors_1 = require("../errors");
const decorators_1 = require("../helpers/decorators");
function Authorized(...rolesOrRolesArray) {
    const roles = decorators_1.getArrayFromOverloadedRest(rolesOrRolesArray);
    return (prototype, propertyKey, descriptor) => {
        if (typeof propertyKey === "symbol") {
            throw new errors_1.SymbolKeysNotSupportedError();
        }
        getMetadataStorage_1.getMetadataStorage().collectAuthorizedFieldMetadata({
            target: prototype.constructor,
            fieldName: propertyKey,
            roles,
        });
    };
}
exports.Authorized = Authorized;
