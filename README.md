# npm-grafana
[![Docker-BuildX-CI-MultiArch](https://github.com/Joshua-Noakes1/npm-grafana/actions/workflows/docker.yml/badge.svg?branch=master)](https://github.com/Joshua-Noakes1/npm-grafana/actions/workflows/docker.yml)
## **Usage**

![imageOfMap](https://raw.githubusercontent.com/Joshua-Noakes1/npm-grafana/master/.github/images/brave_V60TBXFTnG.png)  
After selecing the GeoMap (or equivalent pannel) within the InfluxDB raw editor.

#### [**WorldMap**](https://grafana.com/grafana/plugins/grafana-worldmap-panel/)
```SQL
SELECT count("IP") AS "count" FROM "ReverseProxyConnections" WHERE $timeFilter GROUP BY "IP", "latitude", "longitude", "country", "domain"

```
#### **Table**
```SQL
SELECT "Domain" AS "Domain", "Country", "OS" FROM "ReverseProxyConnections" WHERE $timeFilter GROUP BY "IP"
```
## **Setup**

### **Docker-Cli**

```shell
docker run --name npmgraf -it \
-v ./nginx-proxy-manager/data/logs:/usr/src/app/logs \
-e INFLUX_SERVER=100.101.102.103 \
-e INFLUX_PORT=8086 \
-e INFLUX_DATABASE=npm \
-e INFLUX_USER=root \
-e INFLUX_PASSWORD=password \
ghcr.io/joshua-noakes1/npm-grafana
```

### **Docker-Compose**

```yaml
version: "3.8"
services:
  npm:
    image: ghcr.io/joshua-noakes1/npm-grafana
    container_name: npmgraf
    environment:
      - INFLUX_SERVER=100.101.102.103
      - INFLUX_PORT=8086
      - INFLUX_DATABASE=npm
      - INFLUX_USERNAME=root
      - INFLUX_PASSWORD=password
    volumes:
      - ./nginx-proxy-manager/data/logs:/usr/src/app/logs
```

#### **Acknowledgement**

This project is based on work from [Festeazy](https://github.com/Festeazy/nginxproxymanagerGraf) and their repo [nginxproxymanagerGraf](https://github.com/Festeazy/nginxproxymanagerGraf)

#### **License**

- This repo is under GPL-3.0 more information can be found [here](https://github.com/Joshua-Noakes1/npm-grafana/blob/master/LICENSE)  
  **GPL-3.0 generally comes down to**
  | Permissions | Limitations | Conditions |
  | --- | ----------- | --- |
  | ✔️ Commercial use | ❌ Liability | ℹ️ License and copyright notice |
  | ✔️ Modification | ❌ Warranty | ℹ️ State changes |
  | ✔️ Distribution | | ℹ️ Disclose source |
  | ✔️ Patent use | | ℹ️ Same license |
  | ✔️ Private use | |
- This repo includes GeoLite2 data created by MaxMind, available from  
  [https://dev.maxmind.com/geoip/geolite2-free-geolocation-data?lang=en](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data?lang=en)
