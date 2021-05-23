import { ClassType } from "../interfaces";
import { UnionFromClasses } from "../helpers/utils";
import { ResolveTypeOptions } from "./types";
export interface UnionTypeConfig<TClassTypes extends readonly ClassType[]> extends ResolveTypeOptions<UnionFromClasses<TClassTypes>> {
    name: string;
    description?: string;
    types: () => TClassTypes;
}
export declare function createUnionType<T extends readonly ClassType[]>(config: UnionTypeConfig<T>): UnionFromClasses<T>;
