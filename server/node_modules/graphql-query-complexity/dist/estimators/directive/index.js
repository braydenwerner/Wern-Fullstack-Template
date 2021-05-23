"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const directives_1 = require("graphql/type/directives");
const directiveLocation_1 = require("graphql/language/directiveLocation");
const lodash_get_1 = __importDefault(require("lodash.get"));
function default_1(options) {
    const mergedOptions = Object.assign({ name: 'complexity' }, (options || {}));
    const directive = new directives_1.GraphQLDirective({
        name: mergedOptions.name,
        description: 'Define a relation between the field and other nodes',
        locations: [
            directiveLocation_1.DirectiveLocation.FIELD,
        ],
        args: {
            value: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
                description: 'The complexity value for the field'
            },
            multipliers: {
                type: new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(graphql_1.GraphQLString))
            }
        },
    });
    return (args) => {
        // Ignore if astNode is undefined
        if (!args.field.astNode) {
            return;
        }
        const values = graphql_1.getDirectiveValues(directive, args.field.astNode);
        // Ignore if no directive set
        if (!values) {
            return;
        }
        // Get multipliers
        let totalMultiplier = 1;
        if (values.multipliers) {
            totalMultiplier = values.multipliers.reduce((aggregated, multiplier) => {
                const multiplierValue = lodash_get_1.default(args.args, multiplier);
                if (typeof multiplierValue === 'number') {
                    return aggregated * multiplierValue;
                }
                if (Array.isArray(multiplierValue)) {
                    return aggregated * multiplierValue.length;
                }
                return aggregated;
            }, totalMultiplier);
        }
        return (values.value + args.childComplexity) * totalMultiplier;
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map