"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNodeLike = void 0;
exports.isNodeLike = typeof process === "object" &&
    process &&
    process.release &&
    process.versions &&
    typeof process.versions.node === "string";
//# sourceMappingURL=isNodeLike.js.map