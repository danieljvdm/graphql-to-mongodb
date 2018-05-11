"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var common_1 = require("./common");
var updateTypesCache = {};
var inputTypesCache = {};
var insertTypesCache = {};
var incTypesCache = {};
function getGraphQLUpdateType(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    var updateTypeName = common_1.setSuffix(type.name, 'Type', 'UpdateType');
    return common_1.cache(updateTypesCache, updateTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: updateTypeName,
        fields: getUpdateFields.apply(void 0, [type].concat(excludedFields))
    }); });
}
exports.getGraphQLUpdateType = getGraphQLUpdateType;
function getUpdateFields(graphQLType) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    return function () { return ({
        set: { type: getGraphQLInputType.apply(void 0, [graphQLType].concat(excludedFields)) },
        setOnInsert: { type: getGraphQLInsertTypeNested.apply(void 0, [graphQLType].concat(excludedFields)) },
        inc: { type: getGraphQLIncType.apply(void 0, [graphQLType].concat(excludedFields)) }
    }); };
}
function getGraphQLInputType(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    if (type instanceof graphql_1.GraphQLScalarType ||
        type instanceof graphql_1.GraphQLEnumType) {
        return type;
    }
    if (type instanceof graphql_1.GraphQLNonNull) {
        return getGraphQLInputType(type.ofType);
    }
    if (type instanceof graphql_1.GraphQLList) {
        return new graphql_1.GraphQLList(getGraphQLInputType(type.ofType));
    }
    var inputTypeName = common_1.setSuffix(type.name, 'Type', 'InputType');
    return common_1.cache(inputTypesCache, inputTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: inputTypeName,
        fields: common_1.getUnresolvedFieldsTypes.apply(void 0, [type, getGraphQLInputType].concat(excludedFields))
    }); });
}
function getGraphQLInsertType(graphQLType) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    var inputTypeName = common_1.setSuffix(graphQLType.name, 'Type', 'InsertType');
    return common_1.cache(insertTypesCache, inputTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: inputTypeName,
        fields: getGraphQLInsertTypeFields.apply(void 0, [graphQLType, getGraphQLInsertTypeNested].concat(excludedFields))
    }); });
}
exports.getGraphQLInsertType = getGraphQLInsertType;
function getGraphQLInsertTypeFields(graphQLType, typeResolver) {
    var excludedFields = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        excludedFields[_i - 2] = arguments[_i];
    }
    return function () {
        var fields = common_1.getUnresolvedFieldsTypes.apply(void 0, [graphQLType, typeResolver].concat(excludedFields))();
        var idField = fields['_id'];
        if (idField && idField.type instanceof graphql_1.GraphQLNonNull) {
            idField.type = idField.type.ofType;
        }
        return fields;
    };
}
function getGraphQLInsertTypeNested(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    if (type instanceof graphql_1.GraphQLScalarType ||
        type instanceof graphql_1.GraphQLEnumType) {
        return type;
    }
    if (type instanceof graphql_1.GraphQLNonNull) {
        return new graphql_1.GraphQLNonNull(getGraphQLInsertTypeNested(type.ofType));
    }
    if (type instanceof graphql_1.GraphQLList) {
        return new graphql_1.GraphQLList(getGraphQLInsertTypeNested(type.ofType));
    }
    var inputTypeName = common_1.setSuffix(type.name, 'Type', 'InsertType');
    return common_1.cache(insertTypesCache, inputTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: inputTypeName,
        fields: common_1.getUnresolvedFieldsTypes.apply(void 0, [type, getGraphQLInsertTypeNested].concat(excludedFields))
    }); });
}
function getGraphQLIncType(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    if (type instanceof graphql_1.GraphQLScalarType ||
        type instanceof graphql_1.GraphQLEnumType) {
        if (["Int", "Float"].includes(type.name)) {
            return type;
        }
        return undefined;
    }
    if (type instanceof graphql_1.GraphQLNonNull) {
        return getGraphQLIncType(type.ofType);
    }
    if (type instanceof graphql_1.GraphQLList) {
        return undefined;
    }
    var inputTypeName = common_1.setSuffix(type.name, 'Type', 'IncType');
    return common_1.cache(incTypesCache, inputTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: inputTypeName,
        fields: getGraphQLIncTypeFields.apply(void 0, [type].concat(excludedFields))
    }); });
}
function getGraphQLIncTypeFields(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    return function () {
        var fields = common_1.getUnresolvedFieldsTypes.apply(void 0, [type, getGraphQLIncType].concat(excludedFields))();
        if (Object.keys(fields).length > 0) {
            return fields;
        }
        return _a = {}, _a[common_1.FICTIVE_INC] = { type: graphql_1.GraphQLInt, description: "IGNORE. Due to limitations of the package, objects with no incrementable fields cannot be ommited. All input object types must have at least one field" }, _a;
        var _a;
    };
}
