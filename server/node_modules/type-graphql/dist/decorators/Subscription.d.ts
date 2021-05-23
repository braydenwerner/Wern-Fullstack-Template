import { ResolverFn } from "graphql-subscriptions";
import { ReturnTypeFunc, AdvancedOptions, SubscriptionFilterFunc, SubscriptionTopicFunc } from "./types";
import { MergeExclusive } from "../utils/types";
interface PubSubOptions {
    topics: string | string[] | SubscriptionTopicFunc;
    filter?: SubscriptionFilterFunc;
}
interface SubscribeOptions {
    subscribe: ResolverFn;
}
export declare type SubscriptionOptions = AdvancedOptions & MergeExclusive<PubSubOptions, SubscribeOptions>;
export declare function Subscription(options: SubscriptionOptions): MethodDecorator;
export declare function Subscription(returnTypeFunc: ReturnTypeFunc, options: SubscriptionOptions): MethodDecorator;
export {};
