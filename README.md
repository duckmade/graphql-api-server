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
  app:
    image: ghcr.io/duckmade/graphql-api-server
    restart: unless-stopped
    ports:
      - 4000:4000
    environment:
      PATREON_ID: "<patreon-id>"
      PATREON_SECRET: "<patreon-secret>"
      PATREON_CALLBACK: "<patreon-callback>"
      SENDINBLUE_KEY: "<sendinblue-key>"
      BASE_PATH: "<base-path>"
      ORIGINS: "<origins>"
```

## Parameters

Container images are configured using parameters passed at runtime (such as those above).

|                Parameter                 | Function                                                                                                                                                         |
| :--------------------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|       `-e PATREON_ID=<patreon-id>`       | Patreon ID, used for authentication.                                                                                                                             |
|   `-e PATREON_SECRET=<patreon-secret>`   | Patreon secret for given the Patreon ID, used for authentication.                                                                                                |
| `-e PATREON_CALLBACK=<patreon-callback>` | Patreon callback URL, without trailing slash, for the given Patreon ID, used for authentication. Note that the base-path is appended to this URL.                |
|   `-e SENDINBLUE_KEY=<sendinblue-key>`   | Sendinblue (email provider) API key for sending transactional emails.                                                                                            |
|        `-e BASE_PATH=<base-path>`        | **Optional** - A base-path, including pre-pending slash, to be appended to the host URL for which this server receives requests on. Defaults to an empty string. |
|          `-e ORIGINS=<origins>`          | **Optional** - Comma separated string of allowed CORS origins. Defaults to allow all origins.                                                                    |
