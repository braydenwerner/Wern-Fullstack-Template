import { EdgeServerInfo } from './reportingOperationTypes';
import { Logger } from 'apollo-server-types';
export declare const reportServerInfoGql = "\n  mutation ReportServerInfo($info: EdgeServerInfo!, $executableSchema: String) {\n    me {\n      __typename\n      ... on ServiceMutation {\n        reportServerInfo(info: $info, executableSchema: $executableSchema) {\n          __typename\n          ... on ReportServerInfoError {\n            message\n            code\n          }\n          ... on ReportServerInfoResponse {\n            inSeconds\n            withExecutableSchema\n          }\n        }\n      }\n    }\n  }\n";
export declare type ReportInfoResult = ReportInfoStop | ReportInfoNext;
export interface ReportInfoNext {
    kind: 'next';
    inSeconds: number;
    withExecutableSchema: boolean;
}
export interface ReportInfoStop {
    kind: 'stop';
    stopReporting: true;
}
export declare class SchemaReporter {
    private readonly serverInfo;
    private readonly executableSchemaDocument;
    private readonly endpointUrl;
    private readonly logger;
    private readonly initialReportingDelayInMs;
    private readonly fallbackReportingDelayInMs;
    private isStopped;
    private pollTimer?;
    private readonly headers;
    constructor(options: {
        serverInfo: EdgeServerInfo;
        schemaSdl: string;
        apiKey: string;
        endpointUrl: string | undefined;
        logger: Logger;
        initialReportingDelayInMs: number;
        fallbackReportingDelayInMs: number;
    });
    stopped(): Boolean;
    start(): void;
    stop(): void;
    private sendOneReportAndScheduleNext;
    reportServerInfo(withExecutableSchema: boolean): Promise<ReportInfoResult>;
    private apolloQuery;
}
//# sourceMappingURL=schemaReporter.d.ts.map