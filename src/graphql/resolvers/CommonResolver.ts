import { IResolvers } from "@graphql-tools/utils"
import { SendMailResponse, MutationSendMailArgs } from "../generated"

export const CommonResolver: IResolvers = {
  Mutation: {
    sendMail: async (
      _: void,
      args: MutationSendMailArgs,
      { dataSources }
    ): Promise<SendMailResponse> => {
      const res = dataSources.sendInBlueAPI.sendEmail(args)

      return {
        id: res.messageId,
      }
    },
  },
}
