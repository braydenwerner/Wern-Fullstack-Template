"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OurContextualizedStats = exports.OurReport = exports.SizeEstimator = void 0;
const durationHistogram_1 = require("./durationHistogram");
const apollo_reporting_protobuf_1 = require("apollo-reporting-protobuf");
const iterateOverTrace_1 = require("./iterateOverTrace");
class SizeEstimator {
    constructor() {
        this.bytes = 0;
    }
}
exports.SizeEstimator = SizeEstimator;
class OurReport {
    constructor(header) {
        this.header = header;
        this.tracesPerQuery = Object.create(null);
        this.endTime = null;
        this.sizeEstimator = new SizeEstimator();
    }
    addTrace({ statsReportKey, trace, asTrace, includeTracesContributingToStats, }) {
        const tracesAndStats = this.getTracesAndStats(statsReportKey);
        if (asTrace) {
            const encodedTrace = apollo_reporting_protobuf_1.Trace.encode(trace).finish();
            tracesAndStats.trace.push(encodedTrace);
            this.sizeEstimator.bytes += 2 + encodedTrace.length;
        }
        else {
            tracesAndStats.statsWithContext.addTrace(trace, this.sizeEstimator);
            if (includeTracesContributingToStats) {
                const encodedTrace = apollo_reporting_protobuf_1.Trace.encode(trace).finish();
                tracesAndStats.internalTracesContributingToStats.push(encodedTrace);
                this.sizeEstimator.bytes += 2 + encodedTrace.length;
            }
        }
    }
    getTracesAndStats(statsReportKey) {
        const existing = this.tracesPerQuery[statsReportKey];
        if (existing) {
            return existing;
        }
        this.sizeEstimator.bytes += estimatedBytesForString(statsReportKey);
        return (this.tracesPerQuery[statsReportKey] = new OurTracesAndStats());
    }
}
exports.OurReport = OurReport;
class OurTracesAndStats {
    constructor() {
        this.trace = [];
        this.statsWithContext = new StatsByContext();
        this.internalTracesContributingToStats = [];
    }
}
class StatsByContext {
    constructor() {
        this.map = Object.create(null);
    }
    toArray() {
        return Object.values(this.map);
    }
    addTrace(trace, sizeEstimator) {
        this.getContextualizedStats(trace, sizeEstimator).addTrace(trace, sizeEstimator);
    }
    getContextualizedStats(trace, sizeEstimator) {
        const statsContext = {
            clientName: trace.clientName,
            clientVersion: trace.clientVersion,
            clientReferenceId: trace.clientReferenceId,
        };
        const statsContextKey = JSON.stringify(statsContext);
        const existing = this.map[statsContextKey];
        if (existing) {
            return existing;
        }
        sizeEstimator.bytes +=
            20 +
                estimatedBytesForString(trace.clientName) +
                estimatedBytesForString(trace.clientVersion) +
                estimatedBytesForString(trace.clientReferenceId);
        const contextualizedStats = new OurContextualizedStats(statsContext);
        this.map[statsContextKey] = contextualizedStats;
        return contextualizedStats;
    }
}
class OurContextualizedStats {
    constructor(context) {
        this.context = context;
        this.queryLatencyStats = new OurQueryLatencyStats();
        this.perTypeStat = Object.create(null);
    }
    addTrace(trace, sizeEstimator) {
        var _a;
        this.queryLatencyStats.requestCount++;
        if (trace.fullQueryCacheHit) {
            this.queryLatencyStats.cacheLatencyCount.incrementDuration(trace.durationNs);
            this.queryLatencyStats.cacheHits++;
        }
        else {
            this.queryLatencyStats.latencyCount.incrementDuration(trace.durationNs);
        }
        if (!trace.fullQueryCacheHit && ((_a = trace.cachePolicy) === null || _a === void 0 ? void 0 : _a.maxAgeNs) != null) {
            switch (trace.cachePolicy.scope) {
                case apollo_reporting_protobuf_1.Trace.CachePolicy.Scope.PRIVATE:
                    this.queryLatencyStats.privateCacheTtlCount.incrementDuration(trace.cachePolicy.maxAgeNs);
                    break;
                case apollo_reporting_protobuf_1.Trace.CachePolicy.Scope.PUBLIC:
                    this.queryLatencyStats.publicCacheTtlCount.incrementDuration(trace.cachePolicy.maxAgeNs);
                    break;
            }
        }
        if (trace.persistedQueryHit) {
            this.queryLatencyStats.persistedQueryHits++;
        }
        if (trace.persistedQueryRegister) {
            this.queryLatencyStats.persistedQueryMisses++;
        }
        if (trace.forbiddenOperation) {
            this.queryLatencyStats.forbiddenOperationCount++;
        }
        if (trace.registeredOperation) {
            this.queryLatencyStats.registeredOperationCount++;
        }
        let hasError = false;
        const traceNodeStats = (node, path) => {
            var _a, _b, _c, _d, _e;
            if ((_a = node.error) === null || _a === void 0 ? void 0 : _a.length) {
                hasError = true;
                let currPathErrorStats = this.queryLatencyStats.rootErrorStats;
                path.toArray().forEach((subPath) => {
                    currPathErrorStats = currPathErrorStats.getChild(subPath, sizeEstimator);
                });
                currPathErrorStats.requestsWithErrorsCount += 1;
                currPathErrorStats.errorsCount += node.error.length;
            }
            const fieldName = node.originalFieldName || node.responseName;
            if (node.parentType &&
                fieldName &&
                node.type &&
                node.endTime != null &&
                node.startTime != null &&
                node.endTime >= node.startTime) {
                const typeStat = this.getTypeStat(node.parentType, sizeEstimator);
                const fieldStat = typeStat.getFieldStat(fieldName, node.type, sizeEstimator);
                fieldStat.errorsCount += (_c = (_b = node.error) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
                fieldStat.count++;
                fieldStat.requestsWithErrorsCount +=
                    ((_e = (_d = node.error) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0) > 0 ? 1 : 0;
                fieldStat.latencyCount.incrementDuration(node.endTime - node.startTime);
            }
            return false;
        };
        iterateOverTrace_1.iterateOverTrace(trace, traceNodeStats, true);
        if (hasError) {
            this.queryLatencyStats.requestsWithErrorsCount++;
        }
    }
    getTypeStat(parentType, sizeEstimator) {
        const existing = this.perTypeStat[parentType];
        if (existing) {
            return existing;
        }
        sizeEstimator.bytes += estimatedBytesForString(parentType);
        const typeStat = new OurTypeStat();
        this.perTypeStat[parentType] = typeStat;
        return typeStat;
    }
}
exports.OurContextualizedStats = OurContextualizedStats;
class OurQueryLatencyStats {
    constructor() {
        this.latencyCount = new durationHistogram_1.DurationHistogram();
        this.requestCount = 0;
        this.cacheHits = 0;
        this.persistedQueryHits = 0;
        this.persistedQueryMisses = 0;
        this.cacheLatencyCount = new durationHistogram_1.DurationHistogram();
        this.rootErrorStats = new OurPathErrorStats();
        this.requestsWithErrorsCount = 0;
        this.publicCacheTtlCount = new durationHistogram_1.DurationHistogram();
        this.privateCacheTtlCount = new durationHistogram_1.DurationHistogram();
        this.registeredOperationCount = 0;
        this.forbiddenOperationCount = 0;
    }
}
class OurPathErrorStats {
    constructor() {
        this.children = Object.create(null);
        this.errorsCount = 0;
        this.requestsWithErrorsCount = 0;
    }
    getChild(subPath, sizeEstimator) {
        const existing = this.children[subPath];
        if (existing) {
            return existing;
        }
        const child = new OurPathErrorStats();
        this.children[subPath] = child;
        sizeEstimator.bytes += estimatedBytesForString(subPath) + 4;
        return child;
    }
}
class OurTypeStat {
    constructor() {
        this.perFieldStat = Object.create(null);
    }
    getFieldStat(fieldName, returnType, sizeEstimator) {
        const existing = this.perFieldStat[fieldName];
        if (existing) {
            return existing;
        }
        sizeEstimator.bytes +=
            estimatedBytesForString(fieldName) +
                estimatedBytesForString(returnType) +
                10;
        const fieldStat = new OurFieldStat(returnType);
        this.perFieldStat[fieldName] = fieldStat;
        return fieldStat;
    }
}
class OurFieldStat {
    constructor(returnType) {
        this.returnType = returnType;
        this.errorsCount = 0;
        this.count = 0;
        this.requestsWithErrorsCount = 0;
        this.latencyCount = new durationHistogram_1.DurationHistogram();
    }
}
function estimatedBytesForString(s) {
    return 2 + Buffer.byteLength(s);
}
//# sourceMappingURL=stats.js.map