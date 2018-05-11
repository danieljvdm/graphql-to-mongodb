export interface updateArg {
    setOnInsert?: any;
    set?: any;
    inc?: any;
}
export interface updateObj {
    update?: any;
    options?: any;
}
declare function getMongoDbUpdate(update: updateArg): updateObj;
export default getMongoDbUpdate;
