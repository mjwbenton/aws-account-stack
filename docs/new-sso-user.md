# New SSO user setup

```bash
$ aws cognito-idp admin-create-user --user-pool-id us-east-1_Qpw0ideLV --username $USERNAME --profile admin
$ aws cognito-idp admin-set-user-password --user-pool-id us-east-1_Qpw0ideLV --username $USERNAME --password $PASSWORD --permanent --profile admin
```
