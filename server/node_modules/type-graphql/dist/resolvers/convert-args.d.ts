import { ArgParamMetadata, ArgsParamMetadata } from "../metadata/definitions";
import { ArgsDictionary } from "../interfaces";
export declare function convertArgsToInstance(argsMetadata: ArgsParamMetadata, args: ArgsDictionary): object | undefined;
export declare function convertArgToInstance(argMetadata: ArgParamMetadata, args: ArgsDictionary): any;
