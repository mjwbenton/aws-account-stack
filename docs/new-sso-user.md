# New SSO user setup

With Google OAuth integration, user setup now involves creating a Cognito user and linking it to their Google account.

## Step 1: Create Cognito User

Create a user in the Cognito User Pool with their email address:

```bash
$ aws cognito-idp admin-create-user \
    --user-pool-id us-east-1_Qpw0ideLV \
    --username $EMAIL \
    --user-attributes Name=email,Value=$EMAIL Name=email_verified,Value=true \
    --message-action SUPPRESS \
    --profile admin
```

## Step 2: Link Google Account

Link the Cognito user to their Google account for federated authentication:

```bash
$ aws cognito-idp admin-link-provider-for-user \
    --user-pool-id us-east-1_Qpw0ideLV \
    --destination-user Username=$EMAIL \
    --source-user ProviderName=Google,ProviderAttributeName=email,ProviderAttributeValue=$EMAIL \
    --profile admin
```

## Step 3: Set User Status (Optional)

If needed, confirm the user status:

```bash
$ aws cognito-idp admin-confirm-sign-up \
    --user-pool-id us-east-1_Qpw0ideLV \
    --username $EMAIL \
    --profile admin
```

## Variables

- `$EMAIL`: The user's email address (must match their Google account email)
- User Pool ID: `us-east-1_Qpw0ideLV` (update if different)

## Notes

- Users must use their Google account email address
- The `SUPPRESS` message action prevents Cognito from sending a welcome email
- Users will authenticate via Google OAuth, not Cognito passwords
- Ensure the Google OAuth setup is complete before creating users (see [google-oauth-setup.md](google-oauth-setup.md))

## Troubleshooting

- **User not found**: Ensure the Cognito user exists before linking
- **Email mismatch**: The email in Cognito must exactly match the Google account email
- **Provider error**: Verify Google OAuth configuration is complete and deployed
