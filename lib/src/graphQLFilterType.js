"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var common_1 = require("./common");
var logger_1 = require("./logger");
var filterTypesCache = {};
var objectFilterTypesCache = {};
var scalarFilterTypesCache = {};
var warnedIndependentResolvers = {};
exports.OprType = new graphql_1.GraphQLEnumType({
    name: "Opr",
    values: {
        EQL: { value: "$eq" },
        GT: { value: "$gt" },
        GTE: { value: "$gte" },
        IN: { value: "$in" },
        LT: { value: "$lt" },
        LTE: { value: "$lte" },
        NE: { value: "$ne" },
        NIN: { value: "$nin" }
    }
});
exports.OprExistsType = new graphql_1.GraphQLEnumType({
    name: "OprExists",
    values: {
        EXISTS: { value: "exists" },
        NOT_EXISTS: { value: "not_exists" }
    }
});
function getGraphQLFilterType(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    var filterTypeName = common_1.setSuffix(type.name, "Type", "FilterType");
    return common_1.cache(filterTypesCache, filterTypeName, function () {
        return new graphql_1.GraphQLInputObjectType({
            name: filterTypeName,
            fields: getOrAndFields.apply(void 0, [type].concat(excludedFields))
        });
    });
}
exports.getGraphQLFilterType = getGraphQLFilterType;
function getOrAndFields(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    return function () {
        var generatedFields = common_1.getUnresolvedFieldsTypes.apply(void 0, [type,
            getGraphQLObjectFilterType].concat(excludedFields))();
        warnIndependentResolveFields(type);
        // @ts-ignore
        generatedFields["OR"] = {
            type: new graphql_1.GraphQLList(getGraphQLFilterType.apply(void 0, [type].concat(excludedFields)))
        };
        // @ts-ignore
        generatedFields["AND"] = {
            type: new graphql_1.GraphQLList(getGraphQLFilterType.apply(void 0, [type].concat(excludedFields)))
        };
        return generatedFields;
    };
}
function getGraphQLObjectFilterType(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    if (type instanceof graphql_1.GraphQLScalarType || type instanceof graphql_1.GraphQLEnumType) {
        return getGraphQLScalarFilterType(type);
    }
    if (type instanceof graphql_1.GraphQLNonNull) {
        return getGraphQLObjectFilterType(type.ofType);
    }
    if (type instanceof graphql_1.GraphQLList) {
        return getGraphQLObjectFilterType(type.ofType);
    }
    var typeName = common_1.setSuffix(type.name, "Type", "ObjectFilterType");
    return common_1.cache(objectFilterTypesCache, typeName, function () {
        return new graphql_1.GraphQLInputObjectType({
            name: typeName,
            fields: getInputObjectTypeFields.apply(void 0, [type].concat(excludedFields))
        });
    });
}
function getInputObjectTypeFields(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    return function () {
        var generatedFields = common_1.getUnresolvedFieldsTypes.apply(void 0, [type,
            getGraphQLObjectFilterType].concat(excludedFields))();
        warnIndependentResolveFields(type);
        // @ts-ignore
        generatedFields["opr"] = { type: exports.OprExistsType };
        return generatedFields;
    };
}
function getGraphQLScalarFilterType(scalarType) {
    var typeName = scalarType.toString() + "Filter";
    return common_1.cache(scalarFilterTypesCache, typeName, function () {
        return new graphql_1.GraphQLInputObjectType({
            name: typeName,
            fields: getGraphQLScalarFilterTypeFields(scalarType)
        });
    });
}
function getGraphQLScalarFilterTypeFields(scalarType) {
    return {
        opr: {
            type: exports.OprType,
            deprecationReason: "Switched to the more intuitive operator fields"
        },
        value: {
            type: scalarType,
            deprecationReason: "Switched to the more intuitive operator fields"
        },
        values: {
            type: new graphql_1.GraphQLList(scalarType),
            deprecationReason: "Switched to the more intuitive operator fields"
        },
        EQ: { type: scalarType },
        GT: { type: scalarType },
        GTE: { type: scalarType },
        IN: { type: new graphql_1.GraphQLList(scalarType) },
        LT: { type: scalarType },
        LTE: { type: scalarType },
        NEQ: { type: scalarType },
        NIN: { type: new graphql_1.GraphQLList(scalarType) }
    };
}
function warnIndependentResolveFields(type) {
    common_1.cache(warnedIndependentResolvers, type.toString(), function () {
        var fields = common_1.getTypeFields(type, function (key, field) { return field.resolve && !Array.isArray(field.dependencies); })();
        Object.keys(fields).forEach(function (key) {
            return logger_1.warn("Field " + key + " of type " + type + " has a resolve function and no dependencies");
        });
        return 1;
    });
}
function clearTypeCache() {
    for (var member in filterTypesCache)
        delete filterTypesCache[member];
    for (var member in objectFilterTypesCache)
        delete objectFilterTypesCache[member];
    for (var member in scalarFilterTypesCache)
        delete scalarFilterTypesCache[member];
}
exports.clearTypeCache = clearTypeCache;
