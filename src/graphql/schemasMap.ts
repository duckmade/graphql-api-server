import "graphql-import-node"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { GraphQLSchema } from "graphql"
import * as emptyTypeDefs from "./schemas/empty.graphql"
import * as userTypeDefs from "./schemas/user.graphql"
import * as commonTypeDefs from "./schemas/common.graphql"
import resolvers from "./resolversMap"

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [emptyTypeDefs, userTypeDefs, commonTypeDefs],
  resolvers,
})

export default schema
