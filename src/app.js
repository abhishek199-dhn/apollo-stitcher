// @flow

import express from "express";
import cors from "cors";
import favicon from "serve-favicon";
import path from "path";
import config from "config";
import {ApolloServer, gql} from "apollo-server";
import {registerServer} from "apollo-server-express";
import {mergeSchemas} from "graphql-tools";
import Logger from "./utils/logger";
import routes from "./routes";
import introspection from "./utils/introspection";
import {ApolloEngine} from "apollo-engine";

const cluster = require("cluster");

(async function () {
    try {
        const endpoints = config.get('gql');
        const schemaTypeDefs = await Promise.all(endpoints.map(ep => introspection.getIntrospectSchema(ep)));
        const mergedSchema = mergeSchemas({schemas: schemaTypeDefs});

        const app = express();
        app.set("port", 3000);

        app.use(favicon(path.join(__dirname, "../public", "favicon.ico")));
        app.use(cors("*"));
        app.use("/", routes);

        // catch 404 and forward to error handler
        app.use((req, res, next) => {
            Logger.error("Not Found 404", req);
            const err = new Error("Not Found");
            err.status = 404;
            next(err);
        });

        // development error handler will print stacktrace
        if (app.get("env") === "development") {
            app.use((err, req, res, next) => {
                res.status(err.status || 500);
                Logger.error("error", {
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler no stacktrace leaked to user
        app.use((err, req, res, next) => {
            res.status(err.status || 500);
            Logger.error("error", {
                message: err.message,
                error: err
            });
        });

         const server = new ApolloServer({app, schema: mergedSchema, engine: true});

         // normal ApolloServer listen call but url will contain /graphql
         server.listen({port: 3005}).then(({url}) => {
             Logger.info(`🚀 Server ready at ${url}`);
         });

    } catch (e) {
        Logger.error("error", e);
    }
})();