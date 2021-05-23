"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUnionType = void 0;
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
function createUnionType({ name, description, types, resolveType, }) {
    const unionMetadataSymbol = getMetadataStorage_1.getMetadataStorage().collectUnionMetadata({
        name,
        description,
        getClassTypes: types,
        resolveType,
    });
    return unionMetadataSymbol;
}
exports.createUnionType = createUnionType;
