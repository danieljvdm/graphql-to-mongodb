"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var logger_1 = require("./logger");
function getMongoDbUpdate(update) {
    return logger_1.logOnError(function () {
        return common_1.clear({
            update: {
                $setOnInsert: update.setOnInsert,
                $set: update.set ? flattenMongoDbSet(update.set) : undefined,
                $inc: update.inc
            },
            options: update.setOnInsert ? { upsert: true } : undefined
        }, common_1.FICTIVE_INC);
    });
}
function flattenMongoDbSet(set, path) {
    if (path === void 0) { path = []; }
    return Object.assign.apply(Object, [{}].concat(Object.keys(set)
        .map(function (key) {
        var value = set[key];
        var newPath = path.concat([key]);
        if (typeof value != 'object' ||
            Array.isArray(value) ||
            value instanceof Date ||
            value === null) {
            return _a = {}, _a[newPath.join(".")] = value, _a;
        }
        return flattenMongoDbSet(value, newPath);
        var _a;
    })));
}
exports.default = getMongoDbUpdate;
