import Elysia from "elysia";
import authApi from "./features/auth/api";

const api = new Elysia({ prefix: "/api" })
  .use(authApi)
;

export default api;