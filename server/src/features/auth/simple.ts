import Elysia, { error, t } from "elysia";

const SignUpSchema = t.Object({
  username: t.String(),
  email: t.String({ format: "email" }),
  password: t.RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/),
});

const SignInSchema = t.Object({
  username: t.String(),
  password: t.RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/),
});

const simpleAuth = new Elysia({ prefix: "/simple" })
  .post(
    "/signup",
    ({ body }) => {
      return body;
    },
    { body: SignUpSchema }
  )
  .post(
    "/signin",
    ({ body, cookie: { auth } }) => {
      auth.value = JSON.stringify(body);
    },
    { body: SignInSchema }
  )
  .delete("/signout", ({ cookie: { auth } }) => {
    auth.remove();
    return "signout successfully";
  })
  .get("/refresh", ({ cookie: { auth } }) => {
    if (!auth?.value) return null;
    return JSON.parse(auth.value);
  });

export default simpleAuth;
