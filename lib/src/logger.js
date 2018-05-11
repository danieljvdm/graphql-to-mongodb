"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger = {
    warn: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return console.warn.apply(console, ['\x1b[33m', 'graphql-to-mongodb warning:', '\x1b[0m'].concat(args));
    },
};
function warn(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    if (logger.warn) {
        logger.warn.apply(logger, [message].concat(optionalParams));
    }
}
exports.warn = warn;
function error(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    if (logger.error) {
        logger.error.apply(logger, [message].concat(optionalParams));
    }
}
function setLogger(loggerObject) {
    logger = loggerObject || {};
}
exports.setLogger = setLogger;
function logOnError(action) {
    try {
        return action();
    }
    catch (exception) {
        error('graphql-to-mongodb internal exception:', exception);
        throw exception;
    }
}
exports.logOnError = logOnError;
