"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var common_1 = require("./common");
var logger_1 = require("./logger");
var operatorsMongoDbKeys = {
    EQ: '$eq',
    GT: '$gt',
    GTE: '$gte',
    IN: '$in',
    LT: '$lt',
    LTE: '$lte',
    NEQ: '$ne',
    NIN: '$nin',
};
function getMongoDbFilterOuter(graphQLType, graphQLFilter) {
    if (graphQLFilter === void 0) { graphQLFilter = {}; }
    return logger_1.logOnError(function () {
        return getMongoDbFilter(graphQLType, graphQLFilter);
    });
}
function getMongoDbFilter(graphQLType, graphQLFilter) {
    if (graphQLFilter === void 0) { graphQLFilter = {}; }
    if (!graphql_1.isType(graphQLType))
        throw 'First arg of getMongoDbFilter must be the base graphqlType to be parsed';
    var filter = parseMongoDbFilter(graphQLType, graphQLFilter, [], "OR", "AND");
    if (graphQLFilter["OR"]) {
        filter["$or"] = graphQLFilter["OR"].map(function (_) { return getMongoDbFilter(graphQLType, _); });
    }
    if (graphQLFilter["AND"]) {
        filter["$and"] = graphQLFilter["AND"].map(function (_) { return getMongoDbFilter(graphQLType, _); });
    }
    return filter;
}
function parseMongoDbFilter(type, graphQLFilter, path) {
    var excludedFields = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        excludedFields[_i - 3] = arguments[_i];
    }
    var typeFields = common_1.getTypeFields(type)();
    return Object.assign.apply(Object, [{}].concat(Object.keys(graphQLFilter)
        .filter(function (key) { return !excludedFields.includes(key) && key !== 'opr'; })
        .map(function (key) {
        var fieldFilter = graphQLFilter[key];
        var fieldType = common_1.getInnerType(typeFields[key].type);
        var newPath = path.concat([key]);
        var filters = [];
        if (!common_1.isScalarType(fieldType) && fieldFilter.opr) {
            filters.push(parseMongoExistsFilter(fieldFilter.opr));
        }
        if (common_1.isListType(typeFields[key].type)) {
            var elementFilter = parseMongoDbFieldFilter.apply(void 0, [fieldType, fieldFilter, []].concat(excludedFields));
            if (Object.keys(elementFilter).length > 0) {
                filters.push({ '$elemMatch': elementFilter });
            }
            return filters.length > 0
                ? (_a = {}, _a[newPath.join('.')] = Object.assign.apply(Object, [{}].concat(filters)), _a) : {};
        }
        return Object.assign.apply(Object, [{}, parseMongoDbFieldFilter.apply(void 0, [fieldType, fieldFilter, newPath].concat(excludedFields))].concat(filters.map(function (_) {
            return (_a = {}, _a[newPath.join('.')] = _, _a);
            var _a;
        })));
        var _a;
    })));
}
function parseMongoDbFieldFilter(type, fieldFilter, path) {
    var excludedFields = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        excludedFields[_i - 3] = arguments[_i];
    }
    if (common_1.isScalarType(type)) {
        var elementFilter = parseMongoDbScalarFilter(fieldFilter);
        return Object.keys(elementFilter).length > 0
            ? (_a = {}, _a[path.join(".")] = elementFilter, _a) : {};
    }
    return parseMongoDbFilter.apply(void 0, [type, fieldFilter, path].concat(excludedFields));
    var _a;
}
function parseMongoExistsFilter(exists) {
    return { $exists: exists === 'exists' ? true : false };
}
var dperecatedMessageSent = false;
function parseMongoDbScalarFilter(graphQLFilter) {
    var mongoDbScalarFilter = {};
    Object.keys(graphQLFilter)
        .filter(function (key) { return key !== 'value' && key !== 'values'; })
        .forEach(function (key) {
        var element = graphQLFilter[key];
        ////////////// DEPRECATED /////////////////////////////////////////
        if (key === 'opr') {
            if (!dperecatedMessageSent) {
                logger_1.warn('scalar filter "opr" field is deprecated, please switch to the operator fields');
                dperecatedMessageSent = true;
            }
            if (["$in", "$nin"].includes(element)) {
                if (graphQLFilter['values']) {
                    mongoDbScalarFilter[element] = graphQLFilter['values'];
                }
            }
            else if (graphQLFilter['value'] !== undefined) {
                mongoDbScalarFilter[element] = graphQLFilter['value'];
            }
            ///////////////////////////////////////////////////////////////////
        }
        else {
            mongoDbScalarFilter[operatorsMongoDbKeys[key]] = element;
        }
    });
    return mongoDbScalarFilter;
}
exports.default = getMongoDbFilterOuter;
