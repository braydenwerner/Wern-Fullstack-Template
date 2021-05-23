import { AnyFunction, AnyFunctionMap } from "apollo-server-types";
declare type Args<F> = F extends (...args: infer A) => any ? A : never;
declare type AsFunction<F> = F extends AnyFunction ? F : never;
declare type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
declare type DidEndHook<TArgs extends any[]> = (...args: TArgs) => void;
export declare class Dispatcher<T extends AnyFunctionMap> {
    protected targets: T[];
    constructor(targets: T[]);
    private callTargets;
    invokeHookAsync<TMethodName extends keyof T>(methodName: TMethodName, ...args: Args<T[TMethodName]>): Promise<ReturnType<AsFunction<T[TMethodName]>>[]>;
    invokeHookSync<TMethodName extends keyof T>(methodName: TMethodName, ...args: Args<T[TMethodName]>): ReturnType<AsFunction<T[TMethodName]>>[];
    reverseInvokeHookSync<TMethodName extends keyof T>(methodName: TMethodName, ...args: Args<T[TMethodName]>): ReturnType<AsFunction<T[TMethodName]>>[];
    invokeHooksUntilNonNull<TMethodName extends keyof T>(methodName: TMethodName, ...args: Args<T[TMethodName]>): Promise<UnwrapPromise<ReturnType<AsFunction<T[TMethodName]>>> | null>;
    invokeDidStartHook<TMethodName extends keyof T, TEndHookArgs extends Args<ReturnType<AsFunction<T[TMethodName]>>>>(methodName: TMethodName, ...args: Args<T[TMethodName]>): DidEndHook<TEndHookArgs>;
}
export {};
//# sourceMappingURL=dispatcher.d.ts.map