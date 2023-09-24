import { Duration, Stack, StackProps } from "aws-cdk-lib";
import {
  Effect,
  ManagedPolicy,
  OpenIdConnectPrincipal,
  OpenIdConnectProvider,
  PolicyDocument,
  PolicyStatement,
  Role,
} from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

const GITHUB_USERNAME = "mjwbenton";

const CDK_ROLE_NAME = "github-actions-cdk";
const ADMIN_ROLE_NAME = "github-actions-admin";

export class AwsAccountGithubStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const githubProvider = new OpenIdConnectProvider(
      this,
      "GithubOpenIdConnectProvider",
      {
        url: "https://token.actions.githubusercontent.com",
        clientIds: ["sts.amazonaws.com"],
      }
    );

    const githubPrincipal = new OpenIdConnectPrincipal(
      githubProvider
    ).withConditions({
      StringLike: {
        "token.actions.githubusercontent.com:sub": `repo:${GITHUB_USERNAME}/*:*`,
      },
    });

    new Role(this, "GitHubActionsRole", {
      roleName: CDK_ROLE_NAME,
      assumedBy: githubPrincipal,
      maxSessionDuration: Duration.hours(1),
      inlinePolicies: {
        CdkDeploymentPolicy: new PolicyDocument({
          assignSids: true,
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ["sts:AssumeRole"],
              resources: [`arn:aws:iam::${this.account}:role/cdk-*`],
            }),
          ],
        }),
      },
    });

    new Role(this, "GitHubActionsAdminRole", {
      roleName: ADMIN_ROLE_NAME,
      assumedBy: githubPrincipal,
      maxSessionDuration: Duration.hours(1),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"),
      ],
    });
  }
}
