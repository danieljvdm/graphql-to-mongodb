import { GraphQLObjectType, GraphQLInputType } from "graphql";
declare function getGraphQLSortType(type: GraphQLObjectType, ...excludedFields: string[]): GraphQLInputType;
export default getGraphQLSortType;
