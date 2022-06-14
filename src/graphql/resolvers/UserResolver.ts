import { IResolvers } from "@graphql-tools/utils"
import {
  AuthResponse,
  PatreonStatusResponse,
  MutationRegisterArgs,
  QueryLoginArgs,
} from "../generated"

export const UserResolver: IResolvers = {
  Query: {
    login: async (_: void, args: QueryLoginArgs): Promise<AuthResponse> => ({
      token: "test",
    }),
    patreonStatus: async (
      _: void,
      __: void,
      { dataSources }
    ): Promise<PatreonStatusResponse> =>
      dataSources.patreonAPI.getMemberStatus(),
  },
  Mutation: {
    register: async (
      _: void,
      args: MutationRegisterArgs
    ): Promise<AuthResponse> => ({
      token: "test",
    }),
  },
}
