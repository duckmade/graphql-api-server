import express from "express"
import { AuthorizationCode } from "simple-oauth2"
import {
  PATREON_CALLBACK,
  PATREON_HOST,
  PATREON_ID,
  PATREON_SECRET,
} from "../variables"
import CommonRoutes from "../common/routes"

export default class PatreonRoutes extends CommonRoutes {
  authCode: AuthorizationCode
  redirectUri: string

  constructor(app: express.Application) {
    super(app, "PatreonRoutes")
    this.authCode = new AuthorizationCode({
      client: {
        id: PATREON_ID,
        secret: PATREON_SECRET,
      },
      auth: {
        tokenHost: PATREON_HOST,
        authorizePath: `${PATREON_HOST}/oauth2/authorize`,
        tokenPath: `${PATREON_HOST}/api/oauth2/token`,
      },
    })
    this.redirectUri = `${PATREON_CALLBACK}/patreon/callback`
  }

  configureRoutes() {
    this.app
      .route(`/patreon/auth`)
      .get((req: express.Request, res: express.Response) =>
        res.redirect(
          this.authCode.authorizeURL({
            redirect_uri: this.redirectUri,
            scope: "identity",
            state: req.headers.referer,
          })
        )
      )

    this.app
      .route(`/patreon/callback`)
      .get((req: express.Request, res: express.Response) => {
        const state = req.query.state?.toString() || ""
        Promise.resolve()
          .then(() =>
            this.authCode.getToken({
              code: req.query.code?.toString() || "",
              redirect_uri: this.redirectUri,
            })
          )
          .then((result) =>
            res
              .cookie("patreon", result.token.access_token, {
                expires: result.token.expires_at,
                path: "/",
                secure: true,
              })
              .redirect(state)
          )
          .catch(() =>
            res
              .cookie("patreon", "", { path: "/", secure: true })
              .redirect(state)
          )
      })

    return this.app
  }
}
