import { FieldNode, GraphQLObjectType } from "graphql";
declare function getMongoDbProjection(fieldNodes: ReadonlyArray<FieldNode>, graphQLType: GraphQLObjectType, ...excludedFields: string[]): object;
export default getMongoDbProjection;
