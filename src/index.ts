import http from "http"
import compression from "compression"
import express from "express"
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
  IS_PROD,
  ORIGINS,
  PATREON_HOST,
  PORT,
  SENDINBLUE_HOST,
  SENDINBLUE_KEY,
  SUB_PATH,
} from "./variables"
import CommonRoutes from "./common/routes"
import PatreonRoutes from "./patreon/routes"
import PatreonAPI from "./graphql/apis/patreon"
import SendInBlueAPI from "./graphql/apis/sendinblue"

const app = express()
const httpServer = http.createServer(app)
const routes: CommonRoutes[] = []
const debugLog = debug("app")
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
}
if (!process.env.DEBUG) loggerOptions.meta = false

app.use(express.json())
app.use(compression())
app.use(expressWinston.logger(loggerOptions))

routes.push(new PatreonRoutes(app))

const apollo = new ApolloServer({
  schema,
  csrfPrevention: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    IS_PROD
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
  ],
  dataSources: () => ({
    patreonAPI: new PatreonAPI(PATREON_HOST),
    sendInBlueAPI: new SendInBlueAPI(SENDINBLUE_HOST, SENDINBLUE_KEY),
  }),
  context: ({ req }) => ({
    token: req.headers.authentication || "",
  }),
})

apollo.start().then(() => {
  apollo.applyMiddleware({
    app,
    path: `${SUB_PATH}/graphql`,
    bodyParserConfig: { limit: "50mb" },
    cors: {
      origin: ORIGINS.length >= 1 ? ORIGINS[0] : ORIGINS,
      credentials: true,
      // allowedHeaders: ["Content-Type", "Authorization"],
      // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      // preflightContinue: false,
      // optionsSuccessStatus: 204,
    },
  })

  httpServer.listen(PORT, () => {
    routes.map((r: CommonRoutes) => {
      debugLog(`Routes configured for ${r.getName()}`)
    })
    debugLog(`Apollo GraphQL configured ${apollo.graphqlPath}`)
    console.log(`🚀 DUCKMADE's API server is now running at ${HOST}${SUB_PATH}`)
  })
})
