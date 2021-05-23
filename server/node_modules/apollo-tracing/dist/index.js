"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const graphql_1 = require("graphql");
const { name: PACKAGE_NAME } = require("../package.json");
exports.plugin = (_futureOptions = {}) => () => ({
    requestDidStart() {
        const startWallTime = new Date();
        let endWallTime;
        const startHrTime = process.hrtime();
        let duration;
        const resolverCalls = [];
        return {
            executionDidStart: () => ({
                executionDidEnd: () => {
                    duration = process.hrtime(startHrTime);
                    endWallTime = new Date();
                },
                willResolveField({ info }) {
                    const resolverCall = {
                        path: info.path,
                        fieldName: info.fieldName,
                        parentType: info.parentType,
                        returnType: info.returnType,
                        startOffset: process.hrtime(startHrTime),
                    };
                    resolverCalls.push(resolverCall);
                    return () => {
                        resolverCall.endOffset = process.hrtime(startHrTime);
                    };
                },
            }),
            willSendResponse({ response }) {
                if (typeof endWallTime === 'undefined' ||
                    typeof duration === 'undefined') {
                    return;
                }
                const extensions = response.extensions || (response.extensions = Object.create(null));
                if (typeof extensions.tracing !== 'undefined') {
                    throw new Error(PACKAGE_NAME + ": Could not add `tracing` to " +
                        "`extensions` since `tracing` was unexpectedly already present.");
                }
                extensions.tracing = {
                    version: 1,
                    startTime: startWallTime.toISOString(),
                    endTime: endWallTime.toISOString(),
                    duration: durationHrTimeToNanos(duration),
                    execution: {
                        resolvers: resolverCalls.map(resolverCall => {
                            const startOffset = durationHrTimeToNanos(resolverCall.startOffset);
                            const duration = resolverCall.endOffset
                                ? durationHrTimeToNanos(resolverCall.endOffset) - startOffset
                                : 0;
                            return {
                                path: [...graphql_1.responsePathAsArray(resolverCall.path)],
                                parentType: resolverCall.parentType.toString(),
                                fieldName: resolverCall.fieldName,
                                returnType: resolverCall.returnType.toString(),
                                startOffset,
                                duration,
                            };
                        }),
                    },
                };
            },
        };
    },
});
function durationHrTimeToNanos(hrtime) {
    return hrtime[0] * 1e9 + hrtime[1];
}
//# sourceMappingURL=index.js.map