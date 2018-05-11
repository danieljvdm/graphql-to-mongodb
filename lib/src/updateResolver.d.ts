import { GraphQLResolveInfo, GraphQLFieldResolver, GraphQLObjectType } from 'graphql';
export interface UpdateCallback<TSource, TContext> {
    (filter: object, update: object, options: object, projection: object, source: TSource, args: {
        [argName: string]: any;
    }, context: TContext, info: GraphQLResolveInfo): Promise<any>;
}
export interface UpdateOptions {
    differentOutputType: boolean;
}
export declare function getMongoDbUpdateResolver<TSource, TContext>(graphQLType: GraphQLObjectType, updateCallback: UpdateCallback<TSource, TContext>, updateOptions?: UpdateOptions): GraphQLFieldResolver<TSource, TContext>;
export declare function getGraphQLUpdateArgs(graphQLType: GraphQLObjectType): object;
