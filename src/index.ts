import { App } from "aws-cdk-lib";
import { AwsAccountGithubStack } from "./AwsAccountGithubStack";
import { AwsAccountIdentityCenterStack } from "./AwsAccountIdentityCenterStack";
import { AwsAccountRolesStack } from "./AwsAccountRolesStack";
import { AwsAccountTerraformStack } from "./AwsAccountTerraformStack";
import { ALLIANCEBOOK_ACCOUNT, MANAGEMENT_ACCOUNT } from "./accounts";

const MANAGEMENT_ACCOUNT_ENV = {
  account: MANAGEMENT_ACCOUNT,
  region: "us-east-1",
};

const ALLIANCEBOOK_ACCOUNT_ENV = {
  account: ALLIANCEBOOK_ACCOUNT,
  region: "us-east-1",
};

const app = new App();

// Management Account
new AwsAccountGithubStack(app, "AwsAccountGithub", {
  env: MANAGEMENT_ACCOUNT_ENV,
  accountIds: [MANAGEMENT_ACCOUNT, ALLIANCEBOOK_ACCOUNT],
});
new AwsAccountIdentityCenterStack(app, "AwsAccountIdentityCenter", {
  env: MANAGEMENT_ACCOUNT_ENV,
});
new AwsAccountRolesStack(app, "AwsAccountRoles", {
  env: MANAGEMENT_ACCOUNT_ENV,
});
new AwsAccountTerraformStack(app, "AwsAccountTerraform", {
  env: MANAGEMENT_ACCOUNT_ENV,
  bucketName: "mattb.tech-terraform-state",
});

// AllianceBook Account
new AwsAccountGithubStack(app, `AwsAccountGithub-${ALLIANCEBOOK_ACCOUNT}`, {
  env: ALLIANCEBOOK_ACCOUNT_ENV,
  accountIds: [ALLIANCEBOOK_ACCOUNT],
});
new AwsAccountRolesStack(app, `AwsAccountRoles-${ALLIANCEBOOK_ACCOUNT}`, {
  env: ALLIANCEBOOK_ACCOUNT_ENV,
});
new AwsAccountTerraformStack(
  app,
  `AwsAccountTerraform-${ALLIANCEBOOK_ACCOUNT}`,
  {
    env: ALLIANCEBOOK_ACCOUNT_ENV,
    bucketName: "alliancebook.mattb.tech-terraform-state",
  }
);
