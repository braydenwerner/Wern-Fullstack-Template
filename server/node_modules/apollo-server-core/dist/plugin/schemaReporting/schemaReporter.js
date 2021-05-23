"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaReporter = exports.reportServerInfoGql = void 0;
const apollo_server_env_1 = require("apollo-server-env");
exports.reportServerInfoGql = `
  mutation ReportServerInfo($info: EdgeServerInfo!, $executableSchema: String) {
    me {
      __typename
      ... on ServiceMutation {
        reportServerInfo(info: $info, executableSchema: $executableSchema) {
          __typename
          ... on ReportServerInfoError {
            message
            code
          }
          ... on ReportServerInfoResponse {
            inSeconds
            withExecutableSchema
          }
        }
      }
    }
  }
`;
class SchemaReporter {
    constructor(options) {
        this.headers = new apollo_server_env_1.Headers();
        this.headers.set('Content-Type', 'application/json');
        this.headers.set('x-api-key', options.apiKey);
        this.headers.set('apollographql-client-name', 'ApolloServerPluginSchemaReporting');
        this.headers.set('apollographql-client-version', require('../../../package.json').version);
        this.endpointUrl =
            options.endpointUrl ||
                'https://schema-reporting.api.apollographql.com/api/graphql';
        this.serverInfo = options.serverInfo;
        this.executableSchemaDocument = options.schemaSdl;
        this.isStopped = false;
        this.logger = options.logger;
        this.initialReportingDelayInMs = options.initialReportingDelayInMs;
        this.fallbackReportingDelayInMs = options.fallbackReportingDelayInMs;
    }
    stopped() {
        return this.isStopped;
    }
    start() {
        this.pollTimer = setTimeout(() => this.sendOneReportAndScheduleNext(false), this.initialReportingDelayInMs);
    }
    stop() {
        this.isStopped = true;
        if (this.pollTimer) {
            clearTimeout(this.pollTimer);
            this.pollTimer = undefined;
        }
    }
    sendOneReportAndScheduleNext(sendNextWithExecutableSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pollTimer = undefined;
            if (this.stopped())
                return;
            try {
                const result = yield this.reportServerInfo(sendNextWithExecutableSchema);
                switch (result.kind) {
                    case 'next':
                        this.pollTimer = setTimeout(() => this.sendOneReportAndScheduleNext(result.withExecutableSchema), result.inSeconds * 1000);
                        return;
                    case 'stop':
                        return;
                }
            }
            catch (error) {
                this.logger.error(`Error reporting server info to Apollo during schema reporting: ${error}`);
                this.pollTimer = setTimeout(() => this.sendOneReportAndScheduleNext(false), this.fallbackReportingDelayInMs);
            }
        });
    }
    reportServerInfo(withExecutableSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, errors } = yield this.apolloQuery({
                info: this.serverInfo,
                executableSchema: withExecutableSchema
                    ? this.executableSchemaDocument
                    : null,
            });
            if (errors) {
                throw new Error((errors || []).map((x) => x.message).join('\n'));
            }
            function msgForUnexpectedResponse(data) {
                return [
                    'Unexpected response shape from Apollo when',
                    'reporting server information for schema reporting. If',
                    'this continues, please reach out to support@apollographql.com.',
                    'Received response:',
                    JSON.stringify(data),
                ].join(' ');
            }
            if (!data || !data.me || !data.me.__typename) {
                throw new Error(msgForUnexpectedResponse(data));
            }
            if (data.me.__typename === 'UserMutation') {
                this.isStopped = true;
                throw new Error([
                    'This server was configured with an API key for a user.',
                    "Only a service's API key may be used for schema reporting.",
                    'Please visit the settings for this graph at',
                    'https://studio.apollographql.com/ to obtain an API key for a service.',
                ].join(' '));
            }
            else if (data.me.__typename === 'ServiceMutation' &&
                data.me.reportServerInfo) {
                if (data.me.reportServerInfo.__typename == 'ReportServerInfoResponse') {
                    return {
                        kind: 'next',
                        inSeconds: data.me.reportServerInfo.inSeconds,
                        withExecutableSchema: data.me.reportServerInfo.withExecutableSchema,
                    };
                }
                else {
                    this.logger.error([
                        'Received input validation error from Apollo:',
                        data.me.reportServerInfo.message,
                        'Stopping reporting. Please fix the input errors.',
                    ].join(' '));
                    this.stop();
                    return {
                        stopReporting: true,
                        kind: 'stop',
                    };
                }
            }
            throw new Error(msgForUnexpectedResponse(data));
        });
    }
    apolloQuery(variables) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                query: exports.reportServerInfoGql,
                operationName: 'ReportServerInfo',
                variables: variables,
            };
            const httpRequest = new apollo_server_env_1.Request(this.endpointUrl, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(request),
            });
            const httpResponse = yield apollo_server_env_1.fetch(httpRequest);
            if (!httpResponse.ok) {
                throw new Error([
                    `An unexpected HTTP status code (${httpResponse.status}) was`,
                    'encountered during schema reporting.',
                ].join(' '));
            }
            try {
                return yield httpResponse.json();
            }
            catch (error) {
                throw new Error([
                    "Couldn't report server info to Apollo.",
                    'Parsing response as JSON failed.',
                    'If this continues please reach out to support@apollographql.com',
                    error,
                ].join(' '));
            }
        });
    }
}
exports.SchemaReporter = SchemaReporter;
//# sourceMappingURL=schemaReporter.js.map