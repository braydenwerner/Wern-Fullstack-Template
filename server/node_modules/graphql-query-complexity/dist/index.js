"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QueryComplexity_1 = __importDefault(require("./QueryComplexity"));
__exportStar(require("./estimators"), exports);
__exportStar(require("./QueryComplexity"), exports);
function createQueryComplexityValidator(options) {
    return (context) => {
        return new QueryComplexity_1.default(context, options);
    };
}
exports.default = createQueryComplexityValidator;
//# sourceMappingURL=index.js.map