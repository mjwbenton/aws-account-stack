import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  AccountRecovery,
  UserPool,
  UserPoolClient,
  UserPoolDomain,
} from "aws-cdk-lib/aws-cognito";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";

const CALLBACK_URLS = ["https://lonesome.mattb.tech"];

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
      oAuth: {
        callbackUrls: CALLBACK_URLS,
        logoutUrls: CALLBACK_URLS,
      },
    });

    const userPoolIdParam = new StringParameter(this, "UserPoolIdParam", {
      parameterName: "/mattb-sso/user-pool-id",
      stringValue: userPool.userPoolId,
    });

    const userPoolClientIdParam = new StringParameter(
      this,
      "UserPoolClientIdParam",
      {
        parameterName: "/mattb-sso/user-pool-client-id",
        stringValue: userPoolClient.userPoolClientId,
      }
    );

    new CfnOutput(this, "UserPoolIdParamOutput", {
      value: userPoolIdParam.parameterArn,
    });

    new CfnOutput(this, "UserPoolClientIdParamOutput", {
      value: userPoolClientIdParam.parameterArn,
    });
  }
}
