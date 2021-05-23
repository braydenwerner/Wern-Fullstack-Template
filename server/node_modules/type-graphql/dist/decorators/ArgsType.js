"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgsType = void 0;
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
function ArgsType() {
    return target => {
        getMetadataStorage_1.getMetadataStorage().collectArgsMetadata({
            name: target.name,
            target,
        });
    };
}
exports.ArgsType = ArgsType;
