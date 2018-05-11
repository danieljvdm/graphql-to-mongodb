import { GraphQLInputObjectType, GraphQLEnumType, GraphQLObjectType } from "graphql";
export declare const OprType: GraphQLEnumType;
export declare const OprExistsType: GraphQLEnumType;
export declare function getGraphQLFilterType(type: GraphQLObjectType, ...excludedFields: string[]): GraphQLInputObjectType;
export declare function clearTypeCache(): void;
