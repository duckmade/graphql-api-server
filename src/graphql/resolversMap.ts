import { IResolvers } from "@graphql-tools/utils"
import merge from "lodash/merge"
import { UserResolver } from "./resolvers/UserResolver"
import { CommonResolver } from "./resolvers/CommonResolver"

const resolverMap: IResolvers = merge(UserResolver, CommonResolver)

export default resolverMap
