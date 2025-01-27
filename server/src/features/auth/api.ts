import Elysia from "elysia";
import googleAuth from "./google";

const authApi = new Elysia({ prefix: "/auth" })
  .use(googleAuth)
;

export default authApi;