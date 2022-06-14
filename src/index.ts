import http from "http"
import compression from "compression"
import express from "express"
import cors from "cors"
import CookieParser from "cookie-parser"
import * as winston from "winston"
import * as expressWinston from "express-winston"
import debug from "debug"
import { ApolloServer } from "apollo-server-express"
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core"
import schema from "./graphql/schemasMap"
import {
  SERVER_CORS_ORIGINS,
  PATREON_HOST,
  SENDINBLUE_HOST,
  SENDINBLUE_KEY,
  SERVER_HOST,
  SERVER_PORT,
  PROD,
  SERVER_BASE_PATH,
} from "./variables"
import CommonRoutes from "./common/routes"
import PatreonRoutes from "./patreon/routes"
import PatreonAPI from "./graphql/datasources/patreon"
import SendInBlueAPI from "./graphql/datasources/sendinblue"

const app = express()
const server = express()
server.use(SERVER_BASE_PATH, app)
const httpServer = http.createServer(server)
const routes: CommonRoutes[] = []
const debugLog = debug("server")
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
  meta: !PROD,
}
const corsOptions = {
  origin:
    SERVER_CORS_ORIGINS.length === 1
      ? SERVER_CORS_ORIGINS[0]
      : SERVER_CORS_ORIGINS,
  credentials: true,
}

if (PROD) app.enable("trust proxy")
app.use(express.json())
app.use(cors(corsOptions))
app.use(compression())
app.use(CookieParser())
app.use(expressWinston.logger(loggerOptions))

routes.push(new PatreonRoutes(app))

const apollo = new ApolloServer({
  schema,
  csrfPrevention: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    PROD
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
  ],
  dataSources: () => ({
    patreonAPI: new PatreonAPI(PATREON_HOST),
    sendInBlueAPI: new SendInBlueAPI(SENDINBLUE_HOST, SENDINBLUE_KEY),
  }),
  context: ({ req }) => ({
    cookies: {
      patreon: req.cookies.patreon || "",
    },
    token: req.headers.authentication || "",
  }),
})

apollo.start().then(() => {
  apollo.applyMiddleware({
    app,
    path: `/graphql`,
    bodyParserConfig: { limit: "50mb" },
    cors: false,
  })

  httpServer.listen(SERVER_PORT, SERVER_HOST, () => {
    routes.map((r: CommonRoutes) => {
      debugLog(`Routes configured for ${r.getName()}`)
    })
    debugLog(`GraphQL configured for ApolloServer`)
    console.log(
      `🚀 DUCKMADE's API server is now running at http://${SERVER_HOST}:${SERVER_PORT}${app.path()}`
    )
  })
})
