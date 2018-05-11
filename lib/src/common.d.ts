import { GraphQLType, GraphQLObjectType, GraphQLArgument, GraphQLFieldResolver, FieldDefinitionNode } from "graphql";
export declare const FICTIVE_INC = "FICTIVE_INC";
export declare const FICTIVE_SORT = "FICTIVE_SORT";
export interface cacheCallback<T> {
    (key: any): T;
}
export declare function cache<T>(cacheObj: object, key: any, callback: cacheCallback<T>): T;
export declare function setSuffix(text: string, locate: string, replaceWith: string): string;
export interface FieldFilter {
    (name: string, field: {
        resolve?: Function;
        dependencies?: string[];
    }): Boolean;
}
export interface TypeResolver<T extends GraphQLType> {
    (graphQLType: GraphQLType): T;
}
export interface FieldMap<T extends GraphQLType> {
    [key: string]: Field<T, any, any> & {
        type: T;
    };
}
export interface Field<TType extends GraphQLType, TSource, TContext, TArgs = {
    [argName: string]: any;
}> {
    name: string;
    description: string | void;
    type: TType;
    args: GraphQLArgument[];
    resolve?: GraphQLFieldResolver<TSource, TContext, TArgs>;
    subscribe?: GraphQLFieldResolver<TSource, TContext, TArgs>;
    isDeprecated?: boolean;
    deprecationReason?: string | void;
    astNode?: FieldDefinitionNode | void;
    dependencies?: string[];
}
export declare function getTypeFields<T extends GraphQLType>(graphQLType: GraphQLObjectType, filter?: FieldFilter, typeResolver?: TypeResolver<T>, ...excludedFields: string[]): () => FieldMap<T>;
export declare function getUnresolvedFieldsTypes<T extends GraphQLType>(graphQLType: GraphQLObjectType, typeResolver?: TypeResolver<T>, ...excludedFields: string[]): () => FieldMap<T>;
export declare function getInnerType(graphQLType: GraphQLType): GraphQLType;
export declare function isListType(graphQLType: GraphQLType): boolean;
export declare function isScalarType(graphQLType: GraphQLType): boolean;
export declare function clear(obj: object, ...excludedKeys: string[]): object;
