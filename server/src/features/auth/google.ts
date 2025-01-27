import Elysia, { t } from "elysia";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GGAUTH_CLIENT_ID, 
  process.env.GGAUTH_CLIENT_SECRET,
  "http://localhost:3000/api/auth/google/callback"
);

const googleAuth = new Elysia({ prefix: "/google" })
  .get("/", ({ redirect }) => {
    const url = oauth2Client.generateAuthUrl({
      scope: ["openid", "profile", "email"],
      access_type: "offline",
    })
    return redirect(url);
  })
  .get("/callback", async ({ query: { code } }) => {
    const { tokens } = await oauth2Client.getToken(code);
    const info = await oauth2Client.getTokenInfo(tokens.access_token as string);
    return info;
  }, {
    query: t.Object({
      code: t.String()
    })
  })
;

export default googleAuth;