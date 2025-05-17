# New SSO App Setup

1. Modify the parameters passed to the AwsSSOStack to set callback URL and what account needs to be able to fetch the SSM parameters
2. Deploy
3. Manually go and approve the resource share in the new SSO app account
4. Configure the edge lambda (see lonesome for an example)
