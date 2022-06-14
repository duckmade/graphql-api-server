import { IResolvers } from "@graphql-tools/utils"
import { SendEmailResponse, MutationSendEmailArgs } from "../generated"

export const CommonResolver: IResolvers = {
  Mutation: {
    sendEmail: async (
      _: void,
      args: MutationSendEmailArgs,
      { dataSources }
    ): Promise<SendEmailResponse> => dataSources.sendInBlueAPI.sendEmail(args),
  },
}
