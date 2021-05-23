"use strict";
/**
 * Created by Ivo Meißner on 28.07.17.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const chai_1 = require("chai");
const schema_1 = __importDefault(require("./fixtures/schema"));
const QueryComplexity_1 = __importStar(require("../QueryComplexity"));
const index_1 = require("../index");
const CompatibleValidationContext_1 = require("./fixtures/CompatibleValidationContext");
describe('QueryComplexity analysis', () => {
    const typeInfo = new graphql_1.TypeInfo(schema_1.default);
    it('should calculate complexity', () => {
        const ast = graphql_1.parse(`
      query {
        variableScalar(count: 10)
      }
    `);
        const complexity = QueryComplexity_1.getComplexity({
            estimators: [
                index_1.simpleEstimator({ defaultComplexity: 1 })
            ],
            schema: schema_1.default,
            query: ast
        });
        chai_1.expect(complexity).to.equal(1);
    });
    it('should respect @include(if: false)', () => {
        const ast = graphql_1.parse(`
      query {
        variableScalar(count: 10) @include(if: false)
      }
    `);
        const complexity = QueryComplexity_1.getComplexity({
            estimators: [
                index_1.simpleEstimator({ defaultComplexity: 1 })
            ],
            schema: schema_1.default,
            query: ast
        });
        chai_1.expect(complexity).to.equal(0);
    });
    it('should respect @include(if: true)', () => {
        const ast = graphql_1.parse(`
      query {
        variableScalar(count: 10) @include(if: true)
      }
    `);
        const complexity = QueryComplexity_1.getComplexity({
            estimators: [
                index_1.simpleEstimator({ defaultComplexity: 1 })
            ],
            schema: schema_1.default,
            query: ast
        });
        chai_1.expect(complexity).to.equal(1);
    });
    it('should respect @skip(if: true)', () => {
        const ast = graphql_1.parse(`
      query {
        variableScalar(count: 10) @skip(if: true)
      }
    `);
        const complexity = QueryComplexity_1.getComplexity({
            estimators: [
                index_1.simpleEstimator({ defaultComplexity: 1 })
            ],
            schema: schema_1.default,
            query: ast
        });
        chai_1.expect(complexity).to.equal(0);
    });
    it('should respect @skip(if: false)', () => {
        const ast = graphql_1.parse(`
      query {
        variableScalar(count: 10) @skip(if: false)
      }
    `);
        const complexity = QueryComplexity_1.getComplexity({
            estimators: [
                index_1.simpleEstimator({ defaultComplexity: 1 })
            ],
            schema: schema_1.default,
            query: ast
        });
        chai_1.expect(complexity).to.equal(1);
    });
    it('should respect @skip(if: false) @include(if: true)', () => {
        const ast = graphql_1.parse(`
      query {
        variableScalar(count: 10) @skip(if: false) @include(if: true)
      }
    `);
        const complexity = QueryComplexity_1.getComplexity({
            estimators: [
                index_1.simpleEstimator({ defaultComplexity: 1 })
            ],
            schema: schema_1.default,
            query: ast
        });
        chai_1.expect(complexity).to.equal(1);
    });
    it('should calculate complexity with variables', () => {
        const ast = graphql_1.parse(`
      query Q($count: Int) {
        variableScalar(count: $count)
      }
    `);
        const complexity = QueryComplexity_1.getComplexity({
            estimators: [
                index_1.fieldExtensionsEstimator(),
                index_1.simpleEstimator({ defaultComplexity: 1 })
            ],
            schema: schema_1.default,
            query: ast,
            variables: {
                count: 5,
            },
        });
        chai_1.expect(complexity).to.equal(50);
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
                index_1.simpleEstimator({ defaultComplexity: -100 })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(0);
    });
    it('should ignore unknown fragments', () => {
        const ast = graphql_1.parse(`
      query {
        ...UnknownFragment
        variableScalar(count: 100)
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.simpleEstimator({ defaultComplexity: 10 })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(10);
    });
    it('should ignore inline fragment on unknown type', () => {
        const ast = graphql_1.parse(`
      query {
        ...on UnknownType {
          variableScalar(count: 100)
        }
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.simpleEstimator({ defaultComplexity: 10 })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(0);
    });
    it('should ignore fragment on unknown type', () => {
        const ast = graphql_1.parse(`
      query {
        ...F
      }
      fragment F on UnknownType {
        variableScalar(count: 100)
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.simpleEstimator({ defaultComplexity: 10 })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(0);
    });
    it('should ignore unused variables', () => {
        const ast = graphql_1.parse(`
      query ($unusedVar: ID!) {
        variableScalar(count: 100)
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.simpleEstimator({ defaultComplexity: 10 })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(10);
    });
    it('should ignore unknown field', () => {
        const ast = graphql_1.parse(`
      query {
        unknownField
      }
    `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.simpleEstimator({ defaultComplexity: 10 })
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
                index_1.fieldExtensionsEstimator(),
                index_1.simpleEstimator({
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
                index_1.fieldExtensionsEstimator(),
                index_1.simpleEstimator({
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
                index_1.fieldExtensionsEstimator(),
                index_1.simpleEstimator({
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
                index_1.fieldExtensionsEstimator(),
                index_1.simpleEstimator({
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
                index_1.fieldExtensionsEstimator(),
                index_1.simpleEstimator({
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
                index_1.fieldExtensionsEstimator(),
                index_1.simpleEstimator({
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
                index_1.fieldExtensionsEstimator(),
                index_1.simpleEstimator({
                    defaultComplexity: 1
                })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(visitor.complexity).to.equal(1);
    });
    it('should report error on a missing non-null argument', () => {
        const ast = graphql_1.parse(`
        query {
            requiredArgs
        }
      `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.fieldExtensionsEstimator(),
                index_1.simpleEstimator({
                    defaultComplexity: 1
                })
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(context.getErrors().length).to.equal(1);
        chai_1.expect(context.getErrors()[0].message).to.equal('Argument "count" of required type "Int!" was not provided.');
    });
    it('should report error when no estimator is configured', () => {
        const ast = graphql_1.parse(`
        query {
            scalar
        }
      `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: []
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(context.getErrors().length).to.equal(1);
        chai_1.expect(context.getErrors()[0].message).to.equal('No complexity could be calculated for field Query.scalar. ' +
            'At least one complexity estimator has to return a complexity score.');
    });
    it('should report error when no estimator returns value', () => {
        const ast = graphql_1.parse(`
        query {
            scalar
        }
      `);
        const context = new CompatibleValidationContext_1.CompatibleValidationContext(schema_1.default, ast, typeInfo);
        const visitor = new QueryComplexity_1.default(context, {
            maximumComplexity: 100,
            estimators: [
                index_1.fieldExtensionsEstimator()
            ]
        });
        graphql_1.visit(ast, graphql_1.visitWithTypeInfo(typeInfo, visitor));
        chai_1.expect(context.getErrors().length).to.equal(1);
        chai_1.expect(context.getErrors()[0].message).to.equal('No complexity could be calculated for field Query.scalar. ' +
            'At least one complexity estimator has to return a complexity score.');
    });
    it('should return NaN when no astNode available on field when using directiveEstimator', () => {
        const ast = graphql_1.parse(`
      query {
        _service {
          sdl
        }
      }
    `);
        const complexity = QueryComplexity_1.getComplexity({
            estimators: [
                index_1.directiveEstimator(),
            ],
            schema: schema_1.default,
            query: ast
        });
        chai_1.expect(Number.isNaN(complexity)).to.equal(true);
    });
    it('should skip complexity calculation by directiveEstimator when no astNode available on field', () => {
        const ast = graphql_1.parse(`
      query {
        _service {
          sdl
        }
      }
    `);
        const complexity = QueryComplexity_1.getComplexity({
            estimators: [
                index_1.directiveEstimator(),
                index_1.simpleEstimator({
                    defaultComplexity: 1
                })
            ],
            schema: schema_1.default,
            query: ast
        });
        chai_1.expect(complexity).to.equal(2);
    });
    it('should calculate complexity for specific operation', () => {
        const ast = graphql_1.parse(`
      query Primary {
        scalar
        complexScalar
      }

      query Secondary {
        complexScalar
      }
    `);
        const complexity1 = QueryComplexity_1.getComplexity({
            estimators: [
                index_1.fieldExtensionsEstimator(),
                index_1.simpleEstimator({ defaultComplexity: 1 })
            ],
            schema: schema_1.default,
            query: ast
        });
        chai_1.expect(complexity1).to.equal(41);
        const complexity2 = QueryComplexity_1.getComplexity({
            estimators: [
                index_1.fieldExtensionsEstimator(),
                index_1.simpleEstimator({ defaultComplexity: 1 })
            ],
            schema: schema_1.default,
            query: ast,
            operationName: 'Secondary'
        });
        chai_1.expect(complexity2).to.equal(20);
    });
    it('should calculate max complexity for fragment on union type', () => {
        const query = graphql_1.parse(`
      query Primary {
        union {
          ...on Item {
            scalar
          }
          ...on SecondItem {
            scalar
          }
          ...on SecondItem {
            scalar
          }
        }
      }
    `);
        const complexity = QueryComplexity_1.getComplexity({
            estimators: [
                index_1.fieldExtensionsEstimator(),
                index_1.simpleEstimator({ defaultComplexity: 1 })
            ],
            schema: schema_1.default,
            query,
        });
        chai_1.expect(complexity).to.equal(3);
    });
    it('should calculate max complexity for nested fragment on union type', () => {
        const query = graphql_1.parse(`
      query Primary {
        union {
          ...on Union {
            ...on Item {
              complexScalar1: complexScalar
            } 
          }
          ...on SecondItem {
            scalar
          }
          ...on Item {
            complexScalar2: complexScalar
          }
        }
      }
    `);
        const complexity = QueryComplexity_1.getComplexity({
            estimators: [
                index_1.fieldExtensionsEstimator(),
                index_1.simpleEstimator({ defaultComplexity: 0 })
            ],
            schema: schema_1.default,
            query,
        });
        chai_1.expect(complexity).to.equal(40);
    });
    it('should calculate max complexity for nested fragment on union type + named fragment', () => {
        const query = graphql_1.parse(`
      query Primary {
        union {
          ...F
          ...on SecondItem {
            scalar
          }
          ...on Item {
            complexScalar2: complexScalar
          }
        }
      }
      fragment F on Union {
        ...on Item {
          complexScalar1: complexScalar
        } 
      }
    `);
        const complexity = QueryComplexity_1.getComplexity({
            estimators: [
                index_1.fieldExtensionsEstimator(),
                index_1.simpleEstimator({ defaultComplexity: 0 })
            ],
            schema: schema_1.default,
            query,
        });
        chai_1.expect(complexity).to.equal(40);
    });
    it('should calculate max complexity for multiple interfaces', () => {
        const query = graphql_1.parse(`
      query Primary {
        interface {
          ...on Query {
            complexScalar
          }
          ...on SecondItem {
            name
            name2: name
          }
        }
      }
    `);
        const complexity = QueryComplexity_1.getComplexity({
            estimators: [
                index_1.fieldExtensionsEstimator(),
                index_1.simpleEstimator({ defaultComplexity: 1 })
            ],
            schema: schema_1.default,
            query,
        });
        chai_1.expect(complexity).to.equal(21);
    });
    it('should calculate max complexity for multiple interfaces with nesting', () => {
        const query = graphql_1.parse(`
      query Primary {
        interface {
          ...on Query {
            complexScalar
            ...on Query {
              a: complexScalar
            }
          }
          ...on SecondItem {
            name
            name2: name
          }
        }
      }
    `);
        const complexity = QueryComplexity_1.getComplexity({
            estimators: [
                index_1.fieldExtensionsEstimator(),
                index_1.simpleEstimator({ defaultComplexity: 1 })
            ],
            schema: schema_1.default,
            query,
        });
        chai_1.expect(complexity).to.equal(41); // 1 for interface, 20 * 2 for complexScalar
    });
    it('should calculate max complexity for multiple interfaces with nesting + named fragment', () => {
        const query = graphql_1.parse(`
      query Primary {
        interface {
          ...F
          ...on SecondItem {
            name
            name2: name
          }
        }
      }
      
      fragment F on Query {
        complexScalar
        ...on Query {
          a: complexScalar
        }
      }
    `);
        const complexity = QueryComplexity_1.getComplexity({
            estimators: [
                index_1.fieldExtensionsEstimator(),
                index_1.simpleEstimator({ defaultComplexity: 1 })
            ],
            schema: schema_1.default,
            query,
        });
        chai_1.expect(complexity).to.equal(41); // 1 for interface, 20 * 2 for complexScalar
    });
});
//# sourceMappingURL=QueryComplexity-test.js.map