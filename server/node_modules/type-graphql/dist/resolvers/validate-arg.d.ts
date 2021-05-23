import { TypeValue } from "../decorators/types";
import { ValidateSettings } from "../schema/build-context";
export declare function validateArg<T extends object>(argValue: T | undefined, argType: TypeValue, globalValidate: ValidateSettings, argValidate: ValidateSettings | undefined): Promise<T | undefined>;
