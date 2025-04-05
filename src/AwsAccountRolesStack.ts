import { Duration, Stack, StackProps } from "aws-cdk-lib";
import {
  AccountPrincipal,
  CompositePrincipal,
  Effect,
  ManagedPolicy,
  PolicyDocument,
  PolicyStatement,
  Role,
} from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

type AwsAccountRolesStackProps = StackProps & {
  trustAccountIds?: string[];
};

export class AwsAccountRolesStack extends Stack {
  constructor(scope: Construct, id: string, props?: AwsAccountRolesStackProps) {
    super(scope, id, props);

    const accountIds = [this.account, ...(props?.trustAccountIds ?? [])];

    new Role(this, "AdminRole", {
      roleName: "admin",
      assumedBy: new CompositePrincipal(
        ...accountIds.map((accountId) => new AccountPrincipal(accountId))
      ),
      maxSessionDuration: Duration.hours(1),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"),
      ],
    });

    new Role(this, "CdkDeployRole", {
      roleName: "cdk-deploy",
      assumedBy: new CompositePrincipal(
        ...accountIds.map((accountId) => new AccountPrincipal(accountId))
      ),
      maxSessionDuration: Duration.hours(1),
      inlinePolicies: {
        CdkDeploymentPolicy: new PolicyDocument({
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
  }
}
