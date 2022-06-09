# graphql-api-server

The dockerized GraphQL API express server, using Apollo server, for DUCKMADE.

## Version Tags

This image provides various versions that are available via tags. `latest` tag usually provides the latest stable version. Others are considered under development and caution must be exercised when using them.

|        Tag        | Description       |
| :---------------: | ----------------- |
|      latest       | Stable release    |
| (branch)-(commit) | Unstable releases |

## Usage

Below you'll find a docker compose example to get you up and running

```yaml
version: "3"
services:
  graphql-api-server:
    image: ghrc.io/duckmade/graphql-api-server
    container_name: graphql-api-server
    restart: unless-stopped
    ports:
      - 4000:4000
    environment:
      PATREON_ID: "<patreon-id>"
      PATREON_SECRET: "<patreon-secret>"
      SENDINBLUE_KEY: "<sendinblue-key>"
      HOST: "<host>"
      SUB_PATH: "<sub-path>"
      ORIGINS: "<origins>"
```

## Parameters

Container images are configured using parameters passed at runtime (such as those above).

|              Parameter               | Function                                                                                                                                                                         |
| :----------------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `-e PATREON_ID=<patreon-id>`     | Patreon ID, used for authentication.                                                                                                                                             |
| `-e PATREON_SECRET=<patreon-secret>` | Patreon secret for given Patreon ID, used for authentication.                                                                                                                    |
| `-e SENDINBLUE_KEY=<sendinblue-key>` | Sendinblue (email provider) API key for sending transactional emails.                                                                                                            |
|           `-e HOST=<host>`           | **Optional** - The host URL (and port if necessary) for this server, without trailing slash. Required for Patreon's authentication callback. Defaults to `http://localhost:4000` |
|       `-e SUB_PATH=<sub-path>`       | **Optional** - A sub-path to be appended to the host URL for which this server receives requests on. Defaults to `/api`                                                          |
|        `-e ORIGINS=<origins>`        | **Optional** - Comma separated string of allowed CORS origins. Defaults to `*`                                                                                                   |
