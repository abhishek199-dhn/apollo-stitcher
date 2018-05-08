// @flow

import introspection from "../utils/introspection";
import config from "config";
import {mergeSchemas} from "graphql-tools/dist/index";

const endpoints = config.get('gql');
const schemaTypeDefs = endpoints.map(ep => introspection.getIntrospectSchema(ep));

const mergedSchema = mergeSchemas({schemas: schemaTypeDefs});
