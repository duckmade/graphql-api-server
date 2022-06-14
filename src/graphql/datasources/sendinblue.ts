import { Pool } from "undici"
import { HTTPDataSource } from "apollo-datasource-http"
import { MutationSendEmailArgs, SendEmailResponse } from "../generated"
import { SMTP_TO_EMAIL, SMTP_TO_NAME } from "../../variables"

class SendInBlueAPI extends HTTPDataSource {
  constructor(baseURL: string, apiKey: string) {
    super(baseURL, {
      pool: new Pool(baseURL),
      clientOptions: {
        bodyTimeout: 5000,
        headersTimeout: 2000,
      },
      requestOptions: {
        headers: {
          "X-Client": "client",
          "Api-Key": apiKey,
        },
      },
    })
  }

  async sendEmail(args: MutationSendEmailArgs): Promise<SendEmailResponse> {
    return this.post("/v3/smtp/email", {
      context: {
        tracingName: "sendEmail",
      },
      body: {
        sender: {
          name: args.name,
          email: args.email,
        },
        to: [
          {
            name: SMTP_TO_NAME,
            email: SMTP_TO_EMAIL,
          },
        ],
        replyTo: {
          name: args.name,
          email: args.email,
        },
        htmlContent: `<!DOCTYPE html><html><body><p>${args.message}</p></body></html>`,
        textContent: args.message,
        subject: args.subject,
      },
      json: true,
    }).then((res) => ({
      messageId: (res.body as any).messageId,
    }))
  }
}

export default SendInBlueAPI
