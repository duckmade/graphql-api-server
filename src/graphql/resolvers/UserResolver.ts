import { IResolvers } from "@graphql-tools/utils"
import {
  AuthResponse,
  PatreonStatusResponse,
  MutationRegisterArgs,
  QueryLoginArgs,
} from "../generated"

export const UserResolver: IResolvers = {
  Query: {
    login: async (_: void, args: QueryLoginArgs): Promise<AuthResponse> => {
      return {
        token: "test",
      }
    },
    patreonStatus: async (
      _: void,
      __: void,
      { dataSources }
    ): Promise<PatreonStatusResponse> => {
      const res = dataSources.patreonAPI.getMemberships()

      return {
        member: res.relationships.memberships.data?.length > 0 || false,
      }
    },
  },
  Mutation: {
    register: async (
      _: void,
      args: MutationRegisterArgs
    ): Promise<AuthResponse> => {
      return {
        token: "test",
      }
    },
  },
}
