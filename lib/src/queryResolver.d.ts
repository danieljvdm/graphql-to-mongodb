import { GraphQLResolveInfo, GraphQLFieldResolver, GraphQLObjectType, GraphQLFieldConfigArgumentMap } from "graphql";
export interface QueryCallback<TSource, TContext> {
    (filter: {
        [key: string]: any;
    }, projection: {
        [key: string]: any;
    }, options: {
        [key: string]: any;
    }, source: TSource, args: {
        [argName: string]: any;
    }, context: TContext, info: GraphQLResolveInfo): Promise<any>;
}
export interface QueryOptions {
    differentOutputType: boolean;
}
export declare function getMongoDbQueryResolver<TSource, TContext>(graphQLType: GraphQLObjectType, queryCallback: QueryCallback<TSource, TContext>, queryOptions?: QueryOptions): GraphQLFieldResolver<TSource, TContext>;
export declare function getGraphQLQueryArgs(graphQLType: GraphQLObjectType): GraphQLFieldConfigArgumentMap;
