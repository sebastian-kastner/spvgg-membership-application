# Membership form

Wordpress plugin for a membership application for SpVgg Deuringen, using a single page vue.js application.

## Develop the html form without wordpress

```shell
make serve
``` 

## Build

Run `make build` in the project's root folder

## Standalone local build without wordpress integration

```shell
make local-build
```

## Deploy

1. Build the project (`make build`)
2. Copy everything **except** the `ts` folder to the respective wordpress plugin folder on the server.