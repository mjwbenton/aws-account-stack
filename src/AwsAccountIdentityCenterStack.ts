import { Stack, StackProps } from "aws-cdk-lib";
import * as sso from "aws-cdk-lib/aws-sso";
import { Construct } from "constructs";

const SSO_INSTANCE_ARN = "arn:aws:sso:::instance/ssoins-7223a6ee7aef14b8";
const ADMIN_USER = "84c81448-4031-701c-3506-2e201feea745";

export class AwsAccountIdentityCenterStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const adminPermissionsSet = new sso.CfnPermissionSet(
      this,
      "AdminPermissionSet",
      {
        instanceArn: SSO_INSTANCE_ARN,
        name: "Admin",
        description: "Admin",
        sessionDuration: "PT1H",
        managedPolicies: ["arn:aws:iam::aws:policy/AdministratorAccess"],
      }
    );

    new sso.CfnAssignment(this, "AdminAssignment", {
      instanceArn: SSO_INSTANCE_ARN,
      principalType: "USER",
      principalId: ADMIN_USER,
      permissionSetArn: adminPermissionsSet.attrPermissionSetArn,
      targetType: "AWS_ACCOUNT",
      targetId: this.account,
    });
  }
}
