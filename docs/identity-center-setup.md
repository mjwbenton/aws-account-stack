# Identity Center Setup

This document explains how I setup identity center for personal use in my personal AWS account. This setup allows me to not have any long lived AWS credentials at all on my laptop.

I use Identity Center in an AWS Organization with a single AWS account in it. Identity center uses the standard inbuilt user directory with a single user. That single user is given Admin permissions in the single AWS account. I then use those admin to adopt specific roles for specific tasks, e.g. a `cdk-deploy` role for CDK Deployments.

## Steps

1. Manually enable AWS Organizations
2. Manually enable AWS Identity Center
3. Manually create an IAM Identity Center user
4. Deploy AwsAccountIdentityCenter stack (with correct `SSO_INSTANCE_ARN` and `ADMIN_USER`)
5. Configure local credentials via AWS CLI

```
# Configure SSO
[sso-session my-sso]
sso_start_url = https://d-906799efe9.awsapps.com/start#
sso_region = us-east-1
sso_registration_scopes = sso:account:access

# Admin profile
# Login with admin credentials using `aws sso login --profile admin`
[profile admin]
sso_session = my-sso
sso_account_id = 858777967843
sso_role_name = Admin
region = us-east-1

# Example of a role for specific use.
# After SSO login use this role with `--profile cdk-deploy` or setting
# AWS_PROFILE=cdk-deploy
[profile cdk-deploy]
role_arn = arn:aws:iam::858777967843:role/cdk-deploy
source_profile = admin
```
