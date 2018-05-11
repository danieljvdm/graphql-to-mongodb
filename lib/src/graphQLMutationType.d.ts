import { GraphQLInputObjectType, GraphQLObjectType } from 'graphql';
export declare function getGraphQLUpdateType(type: GraphQLObjectType, ...excludedFields: string[]): GraphQLInputObjectType;
export declare function getGraphQLInsertType(graphQLType: GraphQLObjectType, ...excludedFields: string[]): GraphQLInputObjectType;
