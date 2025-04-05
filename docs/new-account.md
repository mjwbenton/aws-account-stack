# New Account Setup

- Create the new account manually in the AWS Organisations UI. Use `${myEmail}+aws-${accountName}@${emailDomain}` as the email address.
- Add the Account ID to `accounts.ts`. Deploying just this will enable console access via Identity Center.
- Add a profile to `~/.aws/config` for Admin access on the new account.

```
[profile ${accountName}-admin]
sso_session = my-sso
sso_account_id = ${accountId}
sso_role_name = Admin
region = us-east-1
```

- Run CDK bootstrap, trusting the management account

```
$> AWS_PROFILE=${accountName}-admin npx cdk bootstrap aws://${accountId}/us-east-1 --trust 858777967843 --trust-for-lookup 858777967843 --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess
```

- Add the new account ID to the list of those the github actions role can manage. This is what will enable future deployment of stacks to the new account to work in Github actions. Push.

```
new AwsAccountGithubStack(app, "AwsAccountGithub", {
  env: MANAGEMENT_ACCOUNT_ENV,
  accountIds: [MANAGEMENT_ACCOUNT, ..., NEW_ACCOUNT],
});
```

- Add the stacks you want to `index.ts`. Push.
