import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from "apollo-server-core";
import { buildSchema } from "type-graphql";

import { Context } from "../types";
import config from "../mikro-orm.config";
import { PostResolver, UserResolver } from "../resolvers/index.resolver";

const Server = async () => {
  const orm = await MikroORM.init(config);
  orm.getMigrator().up();
  const { em } = orm;

  return new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): Context => ({ em, req, res }),
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });
};

export default Server;
