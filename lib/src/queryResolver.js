"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoDbFilter_1 = require("./mongoDbFilter");
var mongoDbProjection_1 = require("./mongoDbProjection");
var graphQLFilterType_1 = require("./graphQLFilterType");
var graphQLSortType_1 = require("./graphQLSortType");
var graphQLPaginationType_1 = require("./graphQLPaginationType");
var graphql_1 = require("graphql");
var common_1 = require("./common");
var defaultOptions = {
    differentOutputType: false
};
function getMongoDbQueryResolver(graphQLType, queryCallback, queryOptions) {
    var _this = this;
    if (queryOptions === void 0) { queryOptions = defaultOptions; }
    if (!graphql_1.isType(graphQLType))
        throw "getMongoDbQueryResolver must recieve a graphql type";
    if (typeof queryCallback !== "function")
        throw "getMongoDbQueryResolver must recieve a queryCallback function";
    return function (source, args, context, info) { return __awaiter(_this, void 0, void 0, function () {
        var filter, projection, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filter = mongoDbFilter_1.default(graphQLType, args.filter);
                    if (!queryOptions.differentOutputType)
                        projection = mongoDbProjection_1.default(info.fieldNodes, graphQLType);
                    options = {};
                    if (args.sort)
                        options.sort = common_1.clear(args.sort, common_1.FICTIVE_SORT);
                    if (args.pagination && args.pagination.limit)
                        options.limit = args.pagination.limit;
                    if (args.pagination && args.pagination.skip)
                        options.skip = args.pagination.skip;
                    return [4 /*yield*/, queryCallback(filter, projection, options, source, args, context, info)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
}
exports.getMongoDbQueryResolver = getMongoDbQueryResolver;
function getGraphQLQueryArgs(graphQLType) {
    return {
        filter: { type: graphQLFilterType_1.getGraphQLFilterType(graphQLType) },
        sort: { type: graphQLSortType_1.default(graphQLType) },
        pagination: { type: graphQLPaginationType_1.default }
    };
}
exports.getGraphQLQueryArgs = getGraphQLQueryArgs;
