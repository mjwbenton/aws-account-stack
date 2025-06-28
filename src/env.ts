import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
  GOOGLE_CLIENT_ID: str({
    desc: "Google OAuth 2.0 Client ID for Cognito integration",
  }),
  GOOGLE_CLIENT_SECRET: str({
    desc: "Google OAuth 2.0 Client Secret for Cognito integration",
  }),
  SSO_ALLOWED_EMAILS: str({
    desc: "Comma-separated list of email addresses allowed to sign up via SSO",
  }),
});
