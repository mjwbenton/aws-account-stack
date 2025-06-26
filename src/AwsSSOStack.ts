import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  AccountRecovery,
  OAuthScope,
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
  UserPoolDomain,
  UserPoolIdentityProviderGoogle,
} from "aws-cdk-lib/aws-cognito";
import { CfnResourceShare } from "aws-cdk-lib/aws-ram";
import { ParameterTier, StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { env } from "./env";

export class AwsSSOStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & { shareAccountIds: string[]; callbackUrls: string[] }
  ) {
    super(scope, id, props);

    const userPool = new UserPool(this, "Pool", {
      selfSignUpEnabled: false,
      signInAliases: {
        email: true,
      },
      accountRecovery: AccountRecovery.NONE,
    });

    const googleProvider = new UserPoolIdentityProviderGoogle(
      this,
      "GoogleProvider",
      {
        userPool,
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        scopes: ["profile", "email", "openid"],
        attributeMapping: {
          email: {
            attributeName: "email",
          },
          preferredUsername: {
            attributeName: "name",
          },
        },
      }
    );

    const userPoolDomain = new UserPoolDomain(this, "Domain", {
      userPool,
      cognitoDomain: {
        domainPrefix: "mattb-sso",
      },
    });

    const userPoolClient = new UserPoolClient(this, "Client", {
      userPool,
      supportedIdentityProviders: [UserPoolClientIdentityProvider.GOOGLE],
      oAuth: {
        callbackUrls: props.callbackUrls,
        logoutUrls: props.callbackUrls,
        scopes: [OAuthScope.PROFILE, OAuthScope.EMAIL, OAuthScope.OPENID],
      },
    });

    // Ensure the client depends on the Google provider
    userPoolClient.node.addDependency(googleProvider);

    const userPoolIdParam = new StringParameter(this, "UserPoolIdParam", {
      parameterName: "/mattb-sso/user-pool-id",
      stringValue: userPool.userPoolId,
      tier: ParameterTier.ADVANCED,
    });

    const userPoolClientIdParam = new StringParameter(
      this,
      "UserPoolClientIdParam",
      {
        parameterName: "/mattb-sso/user-pool-client-id",
        stringValue: userPoolClient.userPoolClientId,
        tier: ParameterTier.ADVANCED,
      }
    );

    const userPoolDomainParam = new StringParameter(
      this,
      "UserPoolDomainParam",
      {
        parameterName: "/mattb-sso/user-pool-domain",
        stringValue: `${userPoolDomain.domainName}.auth.${this.region}.amazoncognito.com`,
        tier: ParameterTier.ADVANCED,
      }
    );

    new CfnResourceShare(this, "ResourceShare", {
      name: "mattb-sso-param-share",
      allowExternalPrincipals: true,
      principals: props.shareAccountIds,
      resourceArns: [
        userPoolIdParam.parameterArn,
        userPoolClientIdParam.parameterArn,
        userPoolDomainParam.parameterArn,
      ],
    });

    new CfnOutput(this, "UserPoolIdParamOutput", {
      value: userPoolIdParam.parameterArn,
    });

    new CfnOutput(this, "UserPoolClientIdParamOutput", {
      value: userPoolClientIdParam.parameterArn,
    });

    new CfnOutput(this, "UserPoolDomainParamOutput", {
      value: userPoolDomainParam.parameterArn,
    });
  }
}
