"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const Post_1 = require("./entities/Post");
const config_1 = require("./config");
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post_1.Post],
    dbName: 'TypeScript-GraphQL-Next',
    type: 'postgresql',
    debug: !config_1.__prod__,
};
//# sourceMappingURL=mikro-orm.config.js.map