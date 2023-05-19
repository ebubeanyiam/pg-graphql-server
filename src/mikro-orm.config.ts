import { Options } from "@mikro-orm/core";
import path from "path";

import { __prod__ } from "./constants";
import { Post } from "./entities/post";

const config: Options = {
  migrations: {
    path: path.join(__dirname, "./migrations"),
  },
  entities: [Post],
  dbName: "lreddit",
  debug: !__prod__,
  type: "postgresql",
  allowGlobalContext: true,
};

export default config;
