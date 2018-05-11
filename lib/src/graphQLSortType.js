"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var common_1 = require("./common");
var sortTypesCache = {};
function getGraphQLSortType(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    if (type instanceof graphql_1.GraphQLScalarType || type instanceof graphql_1.GraphQLEnumType) {
        return SortType;
    }
    if (type instanceof graphql_1.GraphQLNonNull) {
        return getGraphQLSortType(type.ofType);
    }
    if (type instanceof graphql_1.GraphQLList) {
        return undefined;
    }
    var sortTypeName = common_1.setSuffix(type.name, "Type", "SortType");
    return common_1.cache(sortTypesCache, sortTypeName, function () {
        return new graphql_1.GraphQLInputObjectType({
            name: sortTypeName,
            fields: getGraphQLSortTypeFields.apply(void 0, [type].concat(excludedFields))
        });
    });
}
function getGraphQLSortTypeFields(type) {
    // @ts-ignore
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    return function () {
        var fields = common_1.getUnresolvedFieldsTypes.apply(void 0, [type,
            getGraphQLSortType].concat(excludedFields))();
        if (Object.keys(fields).length > 0) {
            return fields;
        }
        // @ts-ignore
        return _a = {},
            _a[common_1.FICTIVE_SORT] = {
                type: SortType,
                description: "IGNORE. Due to limitations of the package, objects with no sortable fields cannot be ommited. All input object types must have at least one field"
            },
            _a;
        var _a;
    };
}
var SortType = new graphql_1.GraphQLEnumType({
    name: "SortType",
    values: {
        ASC: { value: 1 },
        DESC: { value: -1 }
    }
});
exports.default = getGraphQLSortType;
