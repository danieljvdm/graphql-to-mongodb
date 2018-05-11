export interface Log {
    (message?: any, ...optionalParams: any[]): void;
}
export interface Logger {
    error?: Log;
    warn?: Log;
}
export declare function warn(message?: any, ...optionalParams: any[]): void;
export declare function setLogger(loggerObject: Logger): void;
export declare function logOnError<T>(action: () => T): T;
