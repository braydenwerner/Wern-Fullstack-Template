"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertArgToInstance = exports.convertArgsToInstance = void 0;
const types_1 = require("../helpers/types");
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
const generatedTrees = new Map();
function getInputType(target) {
    return getMetadataStorage_1.getMetadataStorage().inputTypes.find(t => t.target === target);
}
function getArgsType(target) {
    return getMetadataStorage_1.getMetadataStorage().argumentTypes.find(t => t.target === target);
}
function generateInstanceTransformationTree(target) {
    if (generatedTrees.has(target)) {
        return generatedTrees.get(target);
    }
    const inputType = getInputType(target);
    if (!inputType) {
        generatedTrees.set(target, null);
        return null;
    }
    function generateTransformationTree(metadata) {
        let inputFields = metadata.fields;
        let superClass = Object.getPrototypeOf(metadata.target);
        while (superClass.prototype !== undefined) {
            const superInputType = getInputType(superClass);
            if (superInputType) {
                inputFields = [...inputFields, ...superInputType.fields];
            }
            superClass = Object.getPrototypeOf(superClass);
        }
        const transformationTree = {
            target: metadata.target,
            getFields: () => inputFields.map(field => {
                const fieldTarget = field.getType();
                const fieldInputType = getInputType(fieldTarget);
                return {
                    name: field.name,
                    target: fieldTarget,
                    fields: fieldTarget === metadata.target
                        ? transformationTree
                        : fieldInputType && generateTransformationTree(fieldInputType),
                };
            }),
        };
        return transformationTree;
    }
    const generatedTransformationTree = generateTransformationTree(inputType);
    generatedTrees.set(target, generatedTransformationTree);
    return generatedTransformationTree;
}
function convertToInput(tree, data) {
    if (data == null) {
        // skip converting undefined and null
        return data;
    }
    const inputFields = tree.getFields().reduce((fields, field) => {
        const siblings = field.fields;
        const value = data[field.name];
        // don't create property for nullable field
        if (value !== undefined) {
            if (value === null || !siblings) {
                fields[field.name] = types_1.convertToType(field.target, value);
            }
            else if (Array.isArray(value)) {
                fields[field.name] = value.map(itemValue => convertToInput(siblings, itemValue));
            }
            else {
                fields[field.name] = convertToInput(siblings, value);
            }
        }
        return fields;
    }, {});
    return types_1.convertToType(tree.target, inputFields);
}
function convertValueToInstance(target, value) {
    const transformationTree = generateInstanceTransformationTree(target);
    return transformationTree
        ? convertToInput(transformationTree, value)
        : types_1.convertToType(target, value);
}
function convertValuesToInstances(target, value) {
    // skip converting undefined and null
    if (value == null) {
        return value;
    }
    if (Array.isArray(value)) {
        // call function recursively to handle nested arrays case
        return value.map(itemValue => convertValuesToInstances(target, itemValue));
    }
    return convertValueToInstance(target, value);
}
function convertArgsToInstance(argsMetadata, args) {
    const ArgsClass = argsMetadata.getType();
    const argsType = getArgsType(ArgsClass);
    let argsFields = argsType.fields;
    let superClass = Object.getPrototypeOf(argsType.target);
    while (superClass.prototype !== undefined) {
        const superArgumentType = getArgsType(superClass);
        if (superArgumentType) {
            argsFields = [...argsFields, ...superArgumentType.fields];
        }
        superClass = Object.getPrototypeOf(superClass);
    }
    const transformedFields = argsFields.reduce((fields, field) => {
        const fieldValue = args[field.name];
        // don't create property for nullable field
        if (fieldValue !== undefined) {
            const fieldTarget = field.getType();
            fields[field.name] = convertValuesToInstances(fieldTarget, fieldValue);
        }
        return fields;
    }, {});
    return types_1.convertToType(ArgsClass, transformedFields);
}
exports.convertArgsToInstance = convertArgsToInstance;
function convertArgToInstance(argMetadata, args) {
    const argValue = args[argMetadata.name];
    const argTarget = argMetadata.getType();
    return convertValuesToInstances(argTarget, argValue);
}
exports.convertArgToInstance = convertArgToInstance;
