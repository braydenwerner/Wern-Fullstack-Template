"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureInstalledCorrectGraphQLPackage = exports.getPeerDependencyGraphQLRequirement = exports.getInstalledGraphQLVersion = void 0;
const semVer = require("semver");
const errors_1 = require("../errors");
function getInstalledGraphQLVersion() {
    const graphqlPackageJson = require("graphql/package.json");
    return graphqlPackageJson.version;
}
exports.getInstalledGraphQLVersion = getInstalledGraphQLVersion;
function getPeerDependencyGraphQLRequirement() {
    const ownPackageJson = require("../../package.json");
    return ownPackageJson.peerDependencies.graphql;
}
exports.getPeerDependencyGraphQLRequirement = getPeerDependencyGraphQLRequirement;
function ensureInstalledCorrectGraphQLPackage() {
    const installedVersion = getInstalledGraphQLVersion();
    const versionRequirement = getPeerDependencyGraphQLRequirement();
    if (!semVer.satisfies(installedVersion, versionRequirement)) {
        throw new errors_1.UnmetGraphQLPeerDependencyError();
    }
}
exports.ensureInstalledCorrectGraphQLPackage = ensureInstalledCorrectGraphQLPackage;
