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
var common_1 = require("./common");
var graphql_1 = require("graphql");
var logger_1 = require("./logger");
function getMongoDbProjection(fieldNodes, graphQLType) {
    var excludedFields = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        excludedFields[_i - 2] = arguments[_i];
    }
    return logger_1.logOnError(function () {
        if (!Array.isArray(fieldNodes))
            throw 'First argument of "getMongoDbProjection" must be an array';
        if (!graphql_1.isType(graphQLType))
            throw 'Second argument of "getMongoDbProjection" must be a GraphQLType';
        var fieldNode = mergeAndSimplifyNodes(fieldNodes);
        var projection = getProjection.apply(void 0, [fieldNode,
            graphQLType,
            []].concat(excludedFields));
        var resolveFields = getResolveFields(fieldNode, graphQLType);
        var resolveFieldsDependencies = [].concat.apply([], Object.keys(resolveFields).map(function (_) { return resolveFields[_]; }));
        return mergeProjectionAndResolveDependencies(projection, resolveFieldsDependencies);
    });
}
function mergeAndSimplifyNodes(nodes) {
    var getFieldNodeFields = function (fieldNode) {
        return fieldNode.selectionSet.selections
            .filter(function (_) { return _.kind == "Field"; })
            .map(function (_) { return _; });
    };
    var getFieldName = function (fieldNode) { return fieldNode.name.value; };
    var isFieldNodeScalar = function (fieldNode) {
        return !fieldNode.selectionSet;
    };
    var nodesFields = nodes
        .map(getFieldNodeFields)
        .map(function (_) {
        return _.reduce(function (seed, curr) {
            return (__assign({}, seed, (_a = {}, _a[getFieldName(curr)] = curr, _a)));
            var _a;
        }, {});
    });
    var fieldsDictionary = {};
    nodesFields.forEach(function (nodeFields) {
        return Object.keys(nodeFields).forEach(function (key) {
            if (fieldsDictionary[key]) {
                fieldsDictionary[key].push(nodeFields[key]);
            }
            else {
                fieldsDictionary[key] = [nodeFields[key]];
            }
        });
    });
    var node = {};
    Object.keys(fieldsDictionary).forEach(function (key) {
        var fieldNodes = fieldsDictionary[key];
        if (isFieldNodeScalar(fieldNodes[0])) {
            node[key] = 1;
        }
        else {
            node[key] = mergeAndSimplifyNodes(fieldNodes);
        }
    });
    return node;
}
function getProjection(fieldNode, graphQLType, path) {
    if (path === void 0) { path = []; }
    var excludedFields = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        excludedFields[_i - 3] = arguments[_i];
    }
    var typeFields = common_1.getTypeFields(graphQLType)();
    return Object.assign.apply(Object, [{}].concat(Object.keys(fieldNode)
        .filter(function (key) {
        return key !== "__typename" &&
            !excludedFields.includes(key) &&
            !typeFields[key].resolve;
    })
        .map(function (key) {
        var newPath = path.concat([key]);
        var field = fieldNode[key];
        if (field === 1) {
            return _a = {}, _a[newPath.join(".")] = 1, _a;
        }
        return getProjection(field, common_1.getInnerType(typeFields[key].type), newPath);
        var _a;
    })));
}
function getResolveFields(fieldNode, graphQLType, path) {
    if (path === void 0) { path = []; }
    var typeFields = common_1.getTypeFields(graphQLType)();
    return Object.assign.apply(Object, [{}].concat(Object.keys(fieldNode)
        .filter(function (key) { return key !== "__typename"; })
        .map(function (key) {
        var newPath = path.concat([key]);
        var field = fieldNode[key];
        var typeField = typeFields[key];
        if (typeField.resolve) {
            return _a = {},
                _a[newPath.join(".")] = Array.isArray(typeField.dependencies)
                    ? typeField.dependencies
                    : [],
                _a;
        }
        if (field === 1) {
            return {};
        }
        return getResolveFields(field, common_1.getInnerType(typeField.type), newPath);
        var _a;
    })));
}
function mergeProjectionAndResolveDependencies(projection, resolveDependencies) {
    var newProjection = __assign({}, projection);
    var _loop_1 = function () {
        var dependency = resolveDependencies[i];
        var projectionKeys = Object.keys(newProjection);
        if (projectionKeys.includes(dependency)) {
            return "continue";
        }
        if (projectionKeys.some(function (key) { return new RegExp("^" + key + ".").test(dependency); })) {
            return "continue";
        }
        var regex = new RegExp("^" + dependency + ".");
        projectionKeys
            .filter(function (key) { return regex.test(key); })
            .forEach(function (key) { return delete newProjection[key]; });
        newProjection[dependency] = 1;
    };
    for (var i = 0; i < resolveDependencies.length; i++) {
        _loop_1();
    }
    return newProjection;
}
exports.default = getMongoDbProjection;
