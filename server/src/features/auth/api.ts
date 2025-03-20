import Elysia from "elysia";
import googleAuth from "./google";
import simpleAuth from "./simple";

const authApi = new Elysia({ prefix: "/auth" })
  .use(googleAuth)
  .use(simpleAuth)
;

export default authApi;