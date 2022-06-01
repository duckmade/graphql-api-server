import compression from "compression"
import Express from "express"
import { ApolloServer } from "apollo-server-express"
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core"
import schema from "./graphql/schemasMap"
// import { database_connection } from "./database_connection"

const PORT = process.env.PORT || 4000
const SUBPATH = process.env.SUBPATH || "/graphql"
const ORIGINS = (process.env.ORIGINS || "*").split(",")

const app = Express()
app.use(compression())

// await database_connection()
const server = new ApolloServer({
  plugins: [
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
  ],
  schema,
  csrfPrevention: true,
  // context: async ({ req, res }) => await initialize_context(req, res),
})

server.start().then(() => {
  server.applyMiddleware({
    app,
    path: `${SUBPATH}`,
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
  app.listen(PORT, () => {
    console.log(`🚀 DUCKMADE's GraphQL server is now running!`)
    console.log(`\nAccess the API via the following origin(s):`)
    ORIGINS.map((o: string) => {
      if (o === "*") console.log(`http://localhost:${PORT}${SUBPATH}`)
      else console.log(`${o}:${PORT}${SUBPATH}`)
    })
  })
})
