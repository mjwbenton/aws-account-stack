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

type AwsAccountGithubStackProps = StackProps & {
  // Account IDs to enable access to, by enabling AssumeRole access to
  // relevant roles in those accounts.
  assumeAccountIds?: string[];
};

export class AwsAccountGithubStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: AwsAccountGithubStackProps
  ) {
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

    const accountIds = [this.account, ...(props?.assumeAccountIds ?? [])];

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
              actions: ["sts:AssumeRole", "sts:TagSession"],
              resources: accountIds.map(
                (accountId) => `arn:aws:iam::${accountId}:role/cdk-*`
              ),
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
      inlinePolicies: {
        AssumeRolesPolicy: new PolicyDocument({
          assignSids: true,
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ["sts:AssumeRole", "sts:TagSession"],
              resources: accountIds.map(
                (accountId) => `arn:aws:iam::${accountId}:role/*`
              ),
            }),
          ],
        }),
      },
    });
  }
}
