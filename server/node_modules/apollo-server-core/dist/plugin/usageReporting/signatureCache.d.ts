import LRUCache from 'lru-cache';
import { Logger } from 'apollo-server-types';
export declare function createSignatureCache({ logger, }: {
    logger: Logger;
}): LRUCache<string, string>;
export declare function signatureCacheKey(queryHash: string, operationName: string): string;
//# sourceMappingURL=signatureCache.d.ts.map