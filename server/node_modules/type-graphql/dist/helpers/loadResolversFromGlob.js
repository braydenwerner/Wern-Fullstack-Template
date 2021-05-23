"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadResolversFromGlob = exports.findFileNamesFromGlob = void 0;
const glob = require("glob");
function findFileNamesFromGlob(globString) {
    return glob.sync(globString);
}
exports.findFileNamesFromGlob = findFileNamesFromGlob;
function loadResolversFromGlob(globString) {
    const filePaths = findFileNamesFromGlob(globString);
    const modules = filePaths.map(fileName => require(fileName));
}
exports.loadResolversFromGlob = loadResolversFromGlob;
