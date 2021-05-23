"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMethodDecorator = void 0;
const UseMiddleware_1 = require("./UseMiddleware");
function createMethodDecorator(resolver) {
    return UseMiddleware_1.UseMiddleware(resolver);
}
exports.createMethodDecorator = createMethodDecorator;
