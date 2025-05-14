import { Stack, StackProps } from "aws-cdk-lib";
import {
  AccountRecovery,
  CfnIdentityPool,
  UserPool,
  UserPoolClient,
  UserPoolDomain,
} from "aws-cdk-lib/aws-cognito";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";

export class AwsSSOStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const userPool = new UserPool(this, "Pool", {
      selfSignUpEnabled: false,
      signInAliases: {
        email: true,
      },
      accountRecovery: AccountRecovery.NONE,
    });

    new UserPoolDomain(this, "Domain", {
      userPool,
      cognitoDomain: {
        domainPrefix: "mattb-sso",
      },
    });

    const userPoolClient = new UserPoolClient(this, "Client", {
      userPool,
      generateSecret: false,
    });

    new StringParameter(this, "UserPoolIdParam", {
      parameterName: "/mattb-sso/user-pool-id",
      stringValue: userPool.userPoolId,
    });

    new StringParameter(this, "UserPoolClientIdParam", {
      parameterName: "/mattb-sso/user-pool-client-id",
      stringValue: userPoolClient.userPoolClientId,
    });
  }
}
