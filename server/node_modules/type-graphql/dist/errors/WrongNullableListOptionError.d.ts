import { NullableListOptions } from "../decorators/types";
export declare class WrongNullableListOptionError extends Error {
    constructor(targetName: string, propertyName: string, nullable: boolean | NullableListOptions | undefined);
}
