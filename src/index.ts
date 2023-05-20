import express from "express";
import session from "express-session";

import Server from "./services/apollo.service";
import redisStore from "./services/redis.service";
import { __prod__ } from "./constants";

const main = async () => {
  const app = express();
  const server = await Server();

  app.use(
    session({
      name: "qid",
      store: redisStore,
      resave: false, // required: force lightweight session keep alive (touch)
      saveUninitialized: false, // recommended: only save session when data exists
      secret: "mysecretkey",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
    })
  );

  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on port:4000");
  });
};

main().catch((err) => {
  console.log(err);
});
