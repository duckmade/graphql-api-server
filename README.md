# duckmade-graphql-api-server

The dockerized graphql api server for duckmade.

## Version Tags

This image provides various versions that are available via tags. `latest` tag usually provides the latest stable version. Others are considered under development and caution must be exercised when using them.

|        Tag        | Description       |
| :---------------: | ----------------- |
|      latest       | Stable release    |
| (branch)-(commit) | Unstable releases |

## Usage

Here are some example snippets to help you get started creating a container.

### docker-compose (recommended)

```yaml
---
version: "3"
services:
  graphql-api-server:
    image: ghrc.io/duckmade/graphql-api-server
    container_name: graphql-api-server
    restart: unless-stopped
    ports:
      - 4000:4000
    environment:
      - SUBPATH: <subpath>
      - ORIGINS: <origins>
```

### docker cli

```bash
docker run -d \
  --name=graphql-api-server \
  --restart unless-stopped \
  -p 4000:4000 \
  -e SUBPATH=<subpath> \
  -e ORIGINS=<origins> \
  ghrc.io/duckmade/graphql-api-server
```

## Parameters

Container images are configured using parameters passed at runtime (such as those above).

|       Parameter        | Function                                                                   |
| :--------------------: | -------------------------------------------------------------------------- |
| `-e SUBPATH=<subpath>` | Optional - Path for the api to receive requests on. Defaults to `/graphql` |
| `-e ORIGINS=<origins>` | Optional - Comma separated string of allowed CORS origins. Defaults to `*` |
