import { DurationHistogram } from './durationHistogram';
import { IFieldStat, IPathErrorStats, IQueryLatencyStats, IStatsContext, Trace, ITypeStat, IContextualizedStats, ReportHeader, google, ITracesAndStats, IReport } from 'apollo-reporting-protobuf';
export declare class SizeEstimator {
    bytes: number;
}
export declare class OurReport implements Required<IReport> {
    readonly header: ReportHeader;
    constructor(header: ReportHeader);
    readonly tracesPerQuery: Record<string, OurTracesAndStats>;
    endTime: google.protobuf.ITimestamp | null;
    readonly sizeEstimator: SizeEstimator;
    addTrace({ statsReportKey, trace, asTrace, includeTracesContributingToStats, }: {
        statsReportKey: string;
        trace: Trace;
        asTrace: boolean;
        includeTracesContributingToStats: boolean;
    }): void;
    private getTracesAndStats;
}
declare class OurTracesAndStats implements Required<ITracesAndStats> {
    readonly trace: Uint8Array[];
    readonly statsWithContext: StatsByContext;
    readonly internalTracesContributingToStats: Uint8Array[];
}
declare class StatsByContext {
    readonly map: {
        [k: string]: OurContextualizedStats;
    };
    toArray(): IContextualizedStats[];
    addTrace(trace: Trace, sizeEstimator: SizeEstimator): void;
    private getContextualizedStats;
}
export declare class OurContextualizedStats implements Required<IContextualizedStats> {
    readonly context: IStatsContext;
    queryLatencyStats: OurQueryLatencyStats;
    perTypeStat: {
        [k: string]: OurTypeStat;
    };
    constructor(context: IStatsContext);
    addTrace(trace: Trace, sizeEstimator: SizeEstimator): void;
    getTypeStat(parentType: string, sizeEstimator: SizeEstimator): OurTypeStat;
}
declare class OurQueryLatencyStats implements Required<IQueryLatencyStats> {
    latencyCount: DurationHistogram;
    requestCount: number;
    cacheHits: number;
    persistedQueryHits: number;
    persistedQueryMisses: number;
    cacheLatencyCount: DurationHistogram;
    rootErrorStats: OurPathErrorStats;
    requestsWithErrorsCount: number;
    publicCacheTtlCount: DurationHistogram;
    privateCacheTtlCount: DurationHistogram;
    registeredOperationCount: number;
    forbiddenOperationCount: number;
}
declare class OurPathErrorStats implements Required<IPathErrorStats> {
    children: {
        [k: string]: OurPathErrorStats;
    };
    errorsCount: number;
    requestsWithErrorsCount: number;
    getChild(subPath: string, sizeEstimator: SizeEstimator): OurPathErrorStats;
}
declare class OurTypeStat implements Required<ITypeStat> {
    perFieldStat: {
        [k: string]: OurFieldStat;
    };
    getFieldStat(fieldName: string, returnType: string, sizeEstimator: SizeEstimator): OurFieldStat;
}
declare class OurFieldStat implements Required<IFieldStat> {
    readonly returnType: string;
    errorsCount: number;
    count: number;
    requestsWithErrorsCount: number;
    latencyCount: DurationHistogram;
    constructor(returnType: string);
}
export {};
//# sourceMappingURL=stats.d.ts.map