# GraphQl API

Graphql Stitching service for different graphql endpoints. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for 
development and testing purposes. See deployment for notes on how to deploy the project on a live system.


### Installing

```
yarn install 
```

### Graphql endpoint config:

For development mode, insert the endpoints in /config/development.json.

For production build, add the endpoint in /config/production.json.

### Running

```
yarn start 
```
In development mode, the server starts with env variable NODE_TLS_REJECT_UNAUTHORIZED=0, to bypass SSL certificate error.

For Production:
```
yarn start-prod
``` 

