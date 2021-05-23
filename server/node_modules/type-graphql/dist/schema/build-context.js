"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildContext = void 0;
const graphql_subscriptions_1 = require("graphql-subscriptions");
const container_1 = require("../utils/container");
class BuildContext {
    /**
     * Set static fields with current building context data
     */
    static create(options) {
        if (options.dateScalarMode !== undefined) {
            this.dateScalarMode = options.dateScalarMode;
        }
        if (options.scalarsMap !== undefined) {
            this.scalarsMaps = options.scalarsMap;
        }
        if (options.validate !== undefined) {
            this.validate = options.validate;
        }
        if (options.authChecker !== undefined) {
            this.authChecker = options.authChecker;
        }
        if (options.authMode !== undefined) {
            this.authMode = options.authMode;
        }
        if (options.pubSub !== undefined) {
            if ("eventEmitter" in options.pubSub) {
                this.pubSub = new graphql_subscriptions_1.PubSub(options.pubSub);
            }
            else {
                this.pubSub = options.pubSub;
            }
        }
        if (options.globalMiddlewares) {
            this.globalMiddlewares = options.globalMiddlewares;
        }
        this.container = new container_1.IOCContainer(options.container);
        if (options.nullableByDefault !== undefined) {
            this.nullableByDefault = options.nullableByDefault;
        }
    }
    /**
     * Restore default settings
     */
    static reset() {
        this.dateScalarMode = "isoDate";
        this.scalarsMaps = [];
        this.validate = true;
        this.authChecker = undefined;
        this.authMode = "error";
        this.pubSub = new graphql_subscriptions_1.PubSub();
        this.globalMiddlewares = [];
        this.container = new container_1.IOCContainer();
        this.nullableByDefault = false;
    }
}
exports.BuildContext = BuildContext;
// initialize fields
BuildContext.reset();
