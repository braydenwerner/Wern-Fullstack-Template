"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnumValuesMap = exports.convertToType = exports.wrapWithTypeOptions = exports.convertTypeIfScalar = void 0;
const graphql_1 = require("graphql");
const timestamp_1 = require("../scalars/timestamp");
const isodate_1 = require("../scalars/isodate");
const build_context_1 = require("../schema/build-context");
const errors_1 = require("../errors");
function convertTypeIfScalar(type) {
    if (type instanceof graphql_1.GraphQLScalarType) {
        return type;
    }
    const scalarMap = build_context_1.BuildContext.scalarsMaps.find(it => it.type === type);
    if (scalarMap) {
        return scalarMap.scalar;
    }
    switch (type) {
        case String:
            return graphql_1.GraphQLString;
        case Boolean:
            return graphql_1.GraphQLBoolean;
        case Number:
            return graphql_1.GraphQLFloat;
        case Date:
            return build_context_1.BuildContext.dateScalarMode === "isoDate" ? isodate_1.GraphQLISODateTime : timestamp_1.GraphQLTimestamp;
        default:
            return undefined;
    }
}
exports.convertTypeIfScalar = convertTypeIfScalar;
function wrapWithTypeOptions(target, propertyName, type, typeOptions, nullableByDefault) {
    if (!typeOptions.array &&
        (typeOptions.nullable === "items" || typeOptions.nullable === "itemsAndList")) {
        throw new errors_1.WrongNullableListOptionError(target.name, propertyName, typeOptions.nullable);
    }
    if (typeOptions.defaultValue !== undefined &&
        (typeOptions.nullable === false || typeOptions.nullable === "items")) {
        throw new errors_1.ConflictingDefaultWithNullableError(target.name, propertyName, typeOptions.defaultValue, typeOptions.nullable);
    }
    let gqlType = type;
    if (typeOptions.array) {
        const isNullableArray = typeOptions.nullable === "items" ||
            typeOptions.nullable === "itemsAndList" ||
            (typeOptions.nullable === undefined && nullableByDefault === true);
        gqlType = wrapTypeInNestedList(gqlType, typeOptions.arrayDepth, isNullableArray);
    }
    if (typeOptions.defaultValue === undefined &&
        (typeOptions.nullable === false ||
            (typeOptions.nullable === undefined && nullableByDefault === false) ||
            typeOptions.nullable === "items")) {
        gqlType = new graphql_1.GraphQLNonNull(gqlType);
    }
    return gqlType;
}
exports.wrapWithTypeOptions = wrapWithTypeOptions;
const simpleTypes = [String, Boolean, Number, Date, Array, Promise];
function convertToType(Target, data) {
    // skip converting undefined and null
    if (data == null) {
        return data;
    }
    // skip converting scalars (object scalar mostly)
    if (Target instanceof graphql_1.GraphQLScalarType) {
        return data;
    }
    // skip converting simple types
    if (simpleTypes.includes(data.constructor)) {
        return data;
    }
    // skip converting already converted types
    if (data instanceof Target) {
        return data;
    }
    // convert array to instances
    if (Array.isArray(data)) {
        return data.map(item => convertToType(Target, item));
    }
    return Object.assign(new Target(), data);
}
exports.convertToType = convertToType;
function getEnumValuesMap(enumObject) {
    const enumKeys = Object.keys(enumObject).filter(key => isNaN(parseInt(key, 10)));
    const enumMap = enumKeys.reduce((map, key) => {
        map[key] = enumObject[key];
        return map;
    }, {});
    return enumMap;
}
exports.getEnumValuesMap = getEnumValuesMap;
function wrapTypeInNestedList(targetType, depth, nullable) {
    const targetTypeNonNull = nullable ? targetType : new graphql_1.GraphQLNonNull(targetType);
    if (depth === 0) {
        return targetType;
    }
    return wrapTypeInNestedList(new graphql_1.GraphQLList(targetTypeNonNull), depth - 1, nullable);
}
