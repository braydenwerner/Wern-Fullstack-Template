"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompatibleValidationContext = void 0;
const graphql_1 = require("graphql");
/**
 * This class is used to test that validation errors are raised correctly
 *
 * A compatibility layer is necessary to support graphql versions since 15.0.0
 * *as well as* versions prior to 14.5.0 with the same test, because older
 * versions of `ValidationContext` only expose a `getErrors` API and newer
 * versions only expose the `onError` API via a fourth constructor argument.
 *
 * Once we drop support for versions older than 14.5.0 this layer will no
 * longer be necessary and tests may use `ValidationContext` directly using the
 * `onError` API.
 */
class CompatibleValidationContext extends graphql_1.ValidationContext {
    constructor(schema, ast, typeInfo) {
        super(schema, ast, typeInfo, err => this.errors.push(err));
        this.errors = [];
    }
    getErrors() {
        // @ts-ignore
        return super.getErrors ? super.getErrors() : this.errors;
    }
}
exports.CompatibleValidationContext = CompatibleValidationContext;
//# sourceMappingURL=CompatibleValidationContext.js.map