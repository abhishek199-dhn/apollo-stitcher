// @flow

import {createApolloFetch} from 'apollo-fetch';
import {makeRemoteExecutableSchema, introspectSchema} from "graphql-tools";
import logger from "./logger";

export default {
    getIntrospectSchema: async (uri) => {

        // Fetch our schema
        try {
            const fetcher = createApolloFetch({uri});
            fetcher.use(({request, options}, next) => {
                if (!options.headers) {
                    options.headers = {};
                }
                next();
            });

            return makeRemoteExecutableSchema({
                schema: await introspectSchema(fetcher),
                fetcher,
            });

        } catch (e) {
            logger.error(`[getIntrospectSchema] Introspection failed for ${uri} \n Stackstrace: ${e}`);
            return Promise.resolve();
        }
    }
};
