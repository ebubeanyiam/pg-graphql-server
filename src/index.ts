import express from "express";
import session from "express-session";

import Server from "./services/apollo.service";
import redisStore from "./services/redis.service";

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
