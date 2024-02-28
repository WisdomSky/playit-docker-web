# playit-docker-web

_playit-docker-web is a docker image that packages both playit-cli and a no-frills Web UI for an easier way of setting up your playit tunnel._

https://hub.docker.com/r/wisdomsky/playit-docker-web


--- 
## Application Setup
When manually setting up this image, it is crucial to always set the `networking mode` into `host` as without it, the playit service won't be able to access the services running on the host:

    docker run --network host wisdomsky/playit-docker-web:latest

or if using `docker-compose.yml`:

```yaml
services:
  cloudflared:
    image: wisdomsky/playit-docker-web:latest
    restart: unless-stopped
    network_mode: host
```

The Web UI where you can setup your playit agent:

    http://localhost:8008



---
## Additional Parameters

### Environment
| Variable Name | Default value | Required or Optional | Description                                                                                                                                                                            |
|---------------|---------------|---|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| WEBUI_PORT    | 8008          | _Optional_ | The port on the host where the WebUI will be running. Useful when an existing process is running on port `14333` and want to assign playit-docker-web into a different available port. |

example `docker-compose.yaml`:
```yaml
services:
  cloudflared:
    image: wisdomsky/playit-docker-web:latest
    restart: unless-stopped
    network_mode: host
    environment:
      WEBUI_PORT: 8888
```


### Volume
| Container Path | Required or Optional | Description                             |
|---|---|-----------------------------------------|
| /config | _Optional_ | playit-docker-web config directory path |

example `docker-compose.yaml`:
```yaml
services:
  cloudflared:
    image: wisdomsky/playit-docker-web:latest
    restart: unless-stopped
    network_mode: host
    volumes:
      - /mnt/storage/playit-docker/config:/config
```



## Screenshots

![Screenshot 1](https://raw.githubusercontent.com/WisdomSky/playit-docker-web/main/screenshot-1.png)



---

## Issues

For any problems experienced while using the docker image, please submit a new issue to:
https://github.com/WisdomSky/playit-docker-web/issues


