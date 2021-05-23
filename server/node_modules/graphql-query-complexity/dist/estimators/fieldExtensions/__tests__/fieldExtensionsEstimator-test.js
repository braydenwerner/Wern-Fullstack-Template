"use strict";
/**
 * Created by Ivo Meißner on 28.07.17.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const chai_1 = require("chai");
const schema_1 = __importDefault(require("./fixtures/schema"));
const QueryComplexity_1 = __importDefault(require("../../../QueryComplexity"));
const simple_1 = __importDefault(require("../../simple"));
const index_1 = __importDefault(require("../index"));
const CompatibleValidationContext_1 = require("../../../__tests__/fixtures/CompatibleValidationContext");
describe('fieldExtensions estimator', () => {
    const typeInfo = new graphql_1.TypeInfo(schema_1.default);
    it('should consider default scalar cost', () => {
        const ast = graphql_1.parse(`
      query {
        scalar
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default(),
                simple_1.default({
                    defaultComplexity: 1
                })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(1);
    });
    it('should consider custom scalar cost', () => {
        const ast = graphql_1.parse(`
      query {
        complexScalar
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default(),
                simple_1.default({
                    defaultComplexity: 1
                })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(20);
    });
    it('should consider variable scalar cost', () => {
        const ast = graphql_1.parse(`
      query {
        variableScalar(count: 100)
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default(),
                simple_1.default({
                    defaultComplexity: 1
                })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(1000);
    });
    it('should not allow negative cost', () => {
        const ast = graphql_1.parse(`
      query {
        variableScalar(count: -100)
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default(),
                simple_1.default({
                    defaultComplexity: 1
                })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(0);
    });
    it('should report error above threshold', () => {
        const ast = graphql_1.parse(`
      query {
        variableScalar(count: 100)
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default(),
                simple_1.default({
                    defaultComplexity: 1
                })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(1000);
        chai_1.expect(context.getErrors().length).to.equal(1);
        chai_1.expect(context.getErrors()[0].message).to.equal('The query exceeds the maximum complexity of 100. Actual complexity is 1000');
    });
    it('should add inline fragments', () => {
        const ast = graphql_1.parse(`
      query {
        variableScalar(count: 5)
        ...on Query {
          scalar
          alias: scalar
        }
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default(),
                simple_1.default({
                    defaultComplexity: 1
                })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(52);
    });
    it('should add fragments', () => {
        const ast = graphql_1.parse(`
      query {
        scalar
        ...QueryFragment
      }

      fragment QueryFragment on Query {
        variableScalar(count: 2)
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default(),
                simple_1.default({
                    defaultComplexity: 1
                })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(21);
    });
    it('should add complexity for union types', () => {
        const ast = graphql_1.parse(`
      query {
        union {
          ...on Item {
            scalar
            complexScalar
          }
        }
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default(),
                simple_1.default({
                    defaultComplexity: 1
                })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(22);
    });
    it('should add complexity for interface types', () => {
        const ast = graphql_1.parse(`
      query {
        interface {
          name
          ...on NameInterface {
            name
          }
        }
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default(),
                simple_1.default({
                    defaultComplexity: 1
                })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(3);
    });
    it('should add complexity for inline fragments without type condition', () => {
        const ast = graphql_1.parse(`
      query {
        interface {
          ... {
            name
          }
        }
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default(),
                simple_1.default({
                    defaultComplexity: 1
                })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(2);
    });
    it('should add complexity for enum types', () => {
        const ast = graphql_1.parse(`
      query {
        enum
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default(),
                simple_1.default({
                    defaultComplexity: 1
                })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(1);
    });
    it('should error on a missing non-null argument', () => {
        const ast = graphql_1.parse(`
        query {
            requiredArgs
        }
      `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default(),
                simple_1.default({
                    defaultComplexity: 1
                })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(context.getErrors().length).to.equal(1);
        chai_1.expect(context.getErrors()[0].message).to.equal('Argument "count" of required type "Int!" was not provided.');
    });
});
//# sourceMappingURL=fieldExtensionsEstimator-test.js.map