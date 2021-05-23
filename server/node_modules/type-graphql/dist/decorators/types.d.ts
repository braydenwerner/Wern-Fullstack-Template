import { GraphQLScalarType } from "graphql";
import { ResolverFilterData, ClassType, ResolverTopicData, Complexity, TypeResolver } from "../interfaces";
import { ValidateSettings } from "../schema/build-context";
export interface RecursiveArray<TValue> extends Array<RecursiveArray<TValue> | TValue> {
}
export declare type TypeValue = ClassType | GraphQLScalarType | Function | object | symbol;
export declare type ReturnTypeFuncValue = TypeValue | RecursiveArray<TypeValue>;
export declare type TypeValueThunk = (type?: void) => TypeValue;
export declare type ClassTypeResolver = (of?: void) => ClassType | Function;
export declare type ReturnTypeFunc = (returns?: void) => ReturnTypeFuncValue;
export declare type SubscriptionFilterFunc = (resolverFilterData: ResolverFilterData<any, any, any>) => boolean | Promise<boolean>;
export declare type SubscriptionTopicFunc = (resolverTopicData: ResolverTopicData<any, any, any>) => string | string[];
export interface DecoratorTypeOptions {
    nullable?: boolean | NullableListOptions;
    defaultValue?: any;
}
export declare type NullableListOptions = "items" | "itemsAndList";
export interface TypeOptions extends DecoratorTypeOptions {
    array?: boolean;
    arrayDepth?: number;
}
export interface DescriptionOptions {
    description?: string;
}
export interface DeprecationOptions {
    deprecationReason?: string;
}
export interface ValidateOptions {
    validate?: ValidateSettings;
}
export interface ComplexityOptions {
    complexity?: Complexity;
}
export interface SchemaNameOptions {
    name?: string;
}
export interface AbstractClassOptions {
    isAbstract?: boolean;
}
export interface ImplementsClassOptions {
    implements?: Function | Function[];
}
export interface ResolveTypeOptions<TSource = any, TContext = any> {
    resolveType?: TypeResolver<TSource, TContext>;
}
export declare type BasicOptions = DecoratorTypeOptions & DescriptionOptions;
export declare type AdvancedOptions = BasicOptions & DeprecationOptions & SchemaNameOptions & ComplexityOptions;
export interface EnumConfig<TEnum extends object> {
    name: string;
    description?: string;
    valuesConfig?: EnumValuesConfig<TEnum>;
}
export declare type EnumValuesConfig<TEnum extends object> = Partial<Record<keyof TEnum, DescriptionOptions & DeprecationOptions>>;
export declare type MethodAndPropDecorator = PropertyDecorator & MethodDecorator;
