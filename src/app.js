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

const cluster = require("cluster");

(async function () {
    try {
        const endpoints = config.get('gql');
        const schemaTypeDefs = await Promise.all(endpoints.map(ep => introspection.getIntrospectSchema(ep)));
        const mergedSchema = mergeSchemas({schemas: schemaTypeDefs});

        if (cluster.isMaster) {
            const numWorkers = require("os").cpus().length;

            console.log(`Master cluster setting up ${numWorkers} workers...`);

            for (let i = 0; i < numWorkers; i++) {
                cluster.fork();
            }

            cluster.on("online", (worker) => {
                console.log(`Worker ${worker.process.pid} is online`);
            });

            cluster.on("exit", (worker, code, signal) => {
                console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
                console.log("Starting a new worker");
                cluster.fork();
            });
        } else {

            const app = express();
            app.set("port", process.env.PORT || 3000);

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

            const server = new ApolloServer({typeDefs: mergedSchema});
            registerServer({server, app});

            // normal ApolloServer listen call but url will contain /graphql
            server.listen().then(({url}) => {
                Logger.info("Node app is running on port", app.get("port"));
            });
        }
    } catch (e) {
        Logger.error("error", e);
    }
})();