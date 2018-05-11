"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
exports.FICTIVE_INC = "FICTIVE_INC";
exports.FICTIVE_SORT = "FICTIVE_SORT";
function cache(cacheObj, key, callback) {
    var item = cacheObj[key];
    if (item === undefined) {
        item = callback(key);
        cacheObj[key] = item;
    }
    return item;
}
exports.cache = cache;
function setSuffix(text, locate, replaceWith) {
    var regex = new RegExp(locate + "$");
    return regex.test(text)
        ? text.replace(regex, replaceWith)
        : "" + text + replaceWith;
}
exports.setSuffix = setSuffix;
function getTypeFields(graphQLType, filter, typeResolver) {
    if (filter === void 0) { filter = null; }
    if (typeResolver === void 0) { typeResolver = function (type) { return type; }; }
    var excludedFields = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        excludedFields[_i - 3] = arguments[_i];
    }
    return function () {
        var typeFields = graphQLType.getFields();
        var generatedFields = {};
        Object.keys(typeFields)
            .filter(function (key) { return !excludedFields.includes(key); })
            .filter(function (key) { return !filter || filter(key, typeFields[key]); })
            .forEach(function (key) {
            var field = typeFields[key];
            var type = typeResolver(field.type);
            if (type)
                generatedFields[key] = __assign({}, field, { type: type });
        }); //, ...excludedFields
        return generatedFields;
    };
}
exports.getTypeFields = getTypeFields;
function getUnresolvedFieldsTypes(graphQLType, typeResolver) {
    if (typeResolver === void 0) { typeResolver = null; }
    var excludedFields = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        excludedFields[_i - 2] = arguments[_i];
    }
    return function () {
        var fields = getTypeFields.apply(void 0, [graphQLType,
            function (key, field) { return !field.resolve; },
            typeResolver].concat(excludedFields))();
        var fieldsTypes = {};
        Object.keys(fields).forEach(function (key) { return (fieldsTypes[key] = { type: fields[key].type }); });
        return fieldsTypes;
    };
}
exports.getUnresolvedFieldsTypes = getUnresolvedFieldsTypes;
function getInnerType(graphQLType) {
    var innerType = graphQLType;
    while (innerType instanceof graphql_1.GraphQLList ||
        innerType instanceof graphql_1.GraphQLNonNull) {
        innerType = innerType.ofType;
    }
    return innerType;
}
exports.getInnerType = getInnerType;
function isListType(graphQLType) {
    var innerType = graphQLType;
    while (innerType instanceof graphql_1.GraphQLList ||
        innerType instanceof graphql_1.GraphQLNonNull) {
        if (innerType instanceof graphql_1.GraphQLList)
            return true;
        innerType = innerType.ofType;
    }
    return false;
}
exports.isListType = isListType;
function isScalarType(graphQLType) {
    return (graphQLType instanceof graphql_1.GraphQLScalarType ||
        graphQLType instanceof graphql_1.GraphQLEnumType);
}
exports.isScalarType = isScalarType;
function clear(obj) {
    var excludedKeys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedKeys[_i - 1] = arguments[_i];
    }
    return Object.keys(obj).reduce(function (cleared, key) {
        var value = obj[key];
        if (value !== undefined && value !== null && !excludedKeys.includes(key)) {
            if (typeof value != "object" || value instanceof Date || graphql_1.isType(value)) {
                return __assign({}, cleared, (_a = {}, _a[key] = value, _a));
            }
            var objectValue = clear.apply(void 0, [value].concat(excludedKeys));
            if (Object.keys(objectValue).length > 0) {
                return __assign({}, cleared, (_b = {}, _b[key] = objectValue, _b));
            }
        }
        return cleared;
        var _a, _b;
    }, {});
}
exports.clear = clear;
