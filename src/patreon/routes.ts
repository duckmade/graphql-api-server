import express from "express"
import { HOST, SUB_PATH } from "../variables"
import CommonRoutes from "../common/routes"
import oauth2 from "./auth"

export default class PatreonRoutes extends CommonRoutes {
  redirectUri: string

  constructor(app: express.Application) {
    super(app, "PatreonRoutes")
    this.redirectUri = `${HOST}${SUB_PATH}/patreon/callback`
  }

  configureRoutes() {
    this.app
      .route(`${SUB_PATH}/patreon/auth`)
      .get((req: express.Request, res: express.Response) => {
        const authorizationUri = oauth2.authorizeURL({
          redirect_uri: this.redirectUri,
          scope: "identity",
          state: req.headers.referer,
        })

        res
          .status(304)
          .setHeader("Location", authorizationUri)
          .setHeader("Cache-Control", "no-cache")
          .send("")
      })

    this.app
      .route(`${SUB_PATH}/patreon/callback`)
      .get((req: express.Request, res: express.Response) => {
        const code = req.query.code?.toString() || ""
        const state = req.query.state?.toString()
        const html = `
          <html lang="en">
            <head>
              <meta charset="utf-8">
            </head>
            <body>
              <noscript>
                <meta http-equiv="refresh" content="0; url=${state}" />
              </noscript>
            </body>
            <script>
              setTimeout(function() {
                window.location.href = ${JSON.stringify(state)}
              }, 0)
            </script>
          </html>
        `

        Promise.resolve()
          .then(() =>
            oauth2.getToken({
              code: code,
              redirect_uri: this.redirectUri,
            })
          )
          .then((result) =>
            res
              .status(200)
              .setHeader(
                "Set-Cookie",
                `patron=${JSON.stringify({
                  token: result.token.access_token,
                  status: 200,
                })}; ${
                  result.token.expires_at
                    ? `Expires=${result.token.expires_at}; `
                    : ""
                }Path=/; Secure`
              )
              .setHeader("Cache-Control", "no-cache")
              .setHeader("Content-Type", "text/html")
              .send(html)
          )
          .catch((error) =>
            res
              .status(error.statusCode || 500)
              .setHeader(
                "Set-Cookie",
                `patron=${JSON.stringify({
                  token: "",
                  status: error.statusCode || 500,
                })}; Path=/; Secure`
              )
              .setHeader("Cache-Control", "no-cache")
              .setHeader("Content-Type", "text/html")
              .send(html)
          )
      })

    return this.app
  }
}
