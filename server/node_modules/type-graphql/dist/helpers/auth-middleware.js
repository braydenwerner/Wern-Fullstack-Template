"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const errors_1 = require("../errors");
function AuthMiddleware(authChecker, authMode, roles) {
    return async (action, next) => {
        const accessGranted = await authChecker(action, roles);
        if (!accessGranted) {
            if (authMode === "null") {
                return null;
            }
            else if (authMode === "error") {
                throw roles.length === 0 ? new errors_1.UnauthorizedError() : new errors_1.ForbiddenError();
            }
        }
        return next();
    };
}
exports.AuthMiddleware = AuthMiddleware;
