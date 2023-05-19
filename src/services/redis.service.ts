import { createClient } from "redis";
import RedisStore from "connect-redis";

let redisClient = createClient();
redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
  disableTouch: true,
});

export default redisStore;
