# Google OAuth Setup for SSO

## 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project "mattb-sso"
3. Enable the Google+ API for your project

## 2. Configure OAuth Consent Screen

1. Navigate to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in required fields:
   - **App name**: Your SSO application name
   - **User support email**: Your support email
   - **Developer contact information**: Your email
4. Add scopes: `profile`, `email`, `openid`
5. Add users
6. Save and continue

## 3. Create OAuth 2.0 Client

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Select **Web application** as the application type
4. Configure the client:
   - **Name**: "mattb-sso"
   - **Authorized JavaScript origins**:
     ```
     https://mattb-sso.auth.us-east-1.amazoncognito.com
     ```
   - **Authorized redirect URIs**:
     ```
     https://mattb-sso.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
     ```
5. Click **Create**

## 4. Configure Environment Variables

Set GitHub Secrets:

- Go to your repository **Settings** > **Secrets and variables** > **Actions**
- Add repository secrets:
  - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
  - `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret
