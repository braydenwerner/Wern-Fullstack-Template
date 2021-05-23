"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signatureCacheKey = exports.createSignatureCache = void 0;
const lru_cache_1 = __importDefault(require("lru-cache"));
function createSignatureCache({ logger, }) {
    let lastSignatureCacheWarn;
    let lastSignatureCacheDisposals = 0;
    return new lru_cache_1.default({
        length(obj) {
            return Buffer.byteLength(JSON.stringify(obj), 'utf8');
        },
        max: Math.pow(2, 20) * 3,
        dispose() {
            lastSignatureCacheDisposals++;
            if (!lastSignatureCacheWarn ||
                new Date().getTime() - lastSignatureCacheWarn.getTime() > 60000) {
                lastSignatureCacheWarn = new Date();
                logger.warn([
                    'This server is processing a high number of unique operations.  ',
                    `A total of ${lastSignatureCacheDisposals} records have been `,
                    'ejected from the ApolloServerPluginUsageReporting signature cache in the past ',
                    'interval.  If you see this warning frequently, please open an ',
                    'issue on the Apollo Server repository.',
                ].join(''));
                lastSignatureCacheDisposals = 0;
            }
        },
    });
}
exports.createSignatureCache = createSignatureCache;
function signatureCacheKey(queryHash, operationName) {
    return `${queryHash}${operationName && ':' + operationName}`;
}
exports.signatureCacheKey = signatureCacheKey;
//# sourceMappingURL=signatureCache.js.map