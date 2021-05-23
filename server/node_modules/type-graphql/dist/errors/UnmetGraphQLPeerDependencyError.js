"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnmetGraphQLPeerDependencyError = void 0;
const graphql_version_1 = require("../utils/graphql-version");
class UnmetGraphQLPeerDependencyError extends Error {
    constructor() {
        super(`Looks like you use an incorrect version of the 'graphql' package: "${graphql_version_1.getInstalledGraphQLVersion()}". ` +
            `Please ensure that you have installed a version ` +
            `that meets TypeGraphQL's requirement: "${graphql_version_1.getPeerDependencyGraphQLRequirement()}".`);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.UnmetGraphQLPeerDependencyError = UnmetGraphQLPeerDependencyError;
