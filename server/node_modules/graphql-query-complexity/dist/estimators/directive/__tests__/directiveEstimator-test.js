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
const index_1 = __importDefault(require("../index"));
const CompatibleValidationContext_1 = require("../../../__tests__/fixtures/CompatibleValidationContext");
describe('directiveEstimator analysis', () => {
    const typeInfo = new graphql_1.TypeInfo(schema_1.default);
    it('should read complexity from directive', () => {
        const ast = graphql_1.parse(`
      query {
        scalar
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default()
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(5);
    });
    it('should not allow negative cost', () => {
        const ast = graphql_1.parse(`
      query {
        negativeCostScalar
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default()
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(0);
    });
    it('uses default directive name', () => {
        const ast = graphql_1.parse(`
      query {
        multiDirective
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default()
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(2);
    });
    it('uses configured directive name', () => {
        const ast = graphql_1.parse(`
      query {
        multiDirective
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default({
                    name: 'cost'
                })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(1);
    });
    it('returns value + child complexity for configured multipliers but no values', () => {
        const ast = graphql_1.parse(`
      query {
        childList {
          scalar
        }
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default()
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(5);
    });
    it('uses numeric multiplier value', () => {
        const ast = graphql_1.parse(`
      query {
        childList(limit: 2) {
          scalar
        }
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default()
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(10);
    });
    it('combines multiple numeric multiplier values', () => {
        const ast = graphql_1.parse(`
      query {
        childList(limit: 2, first: 2) {
          scalar
        }
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default()
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(20);
    });
    it('uses multiplier array value length', () => {
        const ast = graphql_1.parse(`
      query {
        childList(ids: ["a", "b"]) {
          scalar
        }
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default()
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(10);
    });
    it('uses nested multiplier paths', () => {
        const ast = graphql_1.parse(`
      query {
        childList(filter: {limit: 3}) {
          scalar
        }
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default()
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(15);
    });
    it('uses multi level nested multiplier paths with array reference', () => {
        const ast = graphql_1.parse(`
      query {
        childList(filter: {filters: [{limit: 2}]}) {
          scalar
        }
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default()
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(10);
    });
    it('ignores fields without compexity directive', () => {
        const ast = graphql_1.parse(`
      query {
        noDirective
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.default()
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(context.getErrors().length).to.equal(1);
        chai_1.expect(context.getErrors()[0].message).to.include('No complexity could be calculated for field Query.noDirective');
    });
});
//# sourceMappingURL=directiveEstimator-test.js.map