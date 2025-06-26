import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
  GOOGLE_CLIENT_ID: str({
    desc: "Google OAuth 2.0 Client ID for Cognito integration",
  }),
  GOOGLE_CLIENT_SECRET: str({
    desc: "Google OAuth 2.0 Client Secret for Cognito integration",
  }),
});