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
  HOST,
  ORIGINS,
  PATREON_HOST,
  PORT,
  PROD,
  SENDINBLUE_HOST,
  SENDINBLUE_KEY,
  BASE_PATH,
} from "./variables"
import CommonRoutes from "./common/routes"
import PatreonRoutes from "./patreon/routes"
import PatreonAPI from "./graphql/datasources/patreon"
import SendInBlueAPI from "./graphql/datasources/sendinblue"

const app = express()
const server = express()
server.use(BASE_PATH, app)
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
  origin: ORIGINS.length === 1 ? ORIGINS[0] : ORIGINS,
  credentials: true,
  // allowedHeaders: ["Content-Type", "Authorization"],
  // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  // preflightContinue: false,
  // optionsSuccessStatus: 204,
}

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
  context: ({ req }) => {
    console.log(req.cookies)
    return {
      cookies: {
        patreon: req.cookies.patreon || "",
      },
      token: req.headers.authentication || "",
    }
  },
})

apollo.start().then(() => {
  apollo.applyMiddleware({
    app,
    path: `/graphql`,
    bodyParserConfig: { limit: "50mb" },
    cors: false,
  })

  httpServer.listen(PORT, HOST, () => {
    routes.map((r: CommonRoutes) => {
      debugLog(`Routes configured for ${r.getName()}`)
    })
    debugLog(`GraphQL configured for ApolloServer`)
    console.log(
      `🚀 DUCKMADE's API server is now running at http://${HOST}:${PORT}${app.path()}`
    )
  })
})
