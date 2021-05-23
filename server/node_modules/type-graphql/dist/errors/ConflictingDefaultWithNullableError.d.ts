import { NullableListOptions } from "../decorators/types";
export declare class ConflictingDefaultWithNullableError extends Error {
    constructor(targetName: string, propertyName: string, defaultValue: any, nullable: boolean | NullableListOptions);
}
