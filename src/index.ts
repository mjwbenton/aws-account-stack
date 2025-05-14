import { App } from "aws-cdk-lib";
import { AwsAccountGithubStack } from "./AwsAccountGithubStack";
import { AwsAccountIdentityCenterStack } from "./AwsAccountIdentityCenterStack";
import { AwsAccountRolesStack } from "./AwsAccountRolesStack";
import { AwsAccountTerraformStack } from "./AwsAccountTerraformStack";
import { ALLIANCEBOOK_ACCOUNT, MANAGEMENT_ACCOUNT } from "./accounts";
import { AwsSSOStack } from "./AwsSSOStack";

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
new AwsAccountIdentityCenterStack(app, "AwsAccountIdentityCenter", {
  env: MANAGEMENT_ACCOUNT_ENV,
});
new AwsAccountGithubStack(app, "AwsAccountGithub", {
  env: MANAGEMENT_ACCOUNT_ENV,
  assumeAccountIds: [ALLIANCEBOOK_ACCOUNT],
});
new AwsAccountRolesStack(app, "AwsAccountRoles", {
  env: MANAGEMENT_ACCOUNT_ENV,
});
new AwsAccountTerraformStack(app, "AwsAccountTerraform", {
  env: MANAGEMENT_ACCOUNT_ENV,
  bucketName: "mattb.tech-terraform-state",
});
new AwsSSOStack(app, "AwsSSO", {
  env: MANAGEMENT_ACCOUNT_ENV,
});

// AllianceBook Account
new AwsAccountRolesStack(app, `AwsAccountRoles-${ALLIANCEBOOK_ACCOUNT}`, {
  env: ALLIANCEBOOK_ACCOUNT_ENV,
  trustAccountIds: [MANAGEMENT_ACCOUNT],
});
new AwsAccountTerraformStack(
  app,
  `AwsAccountTerraform-${ALLIANCEBOOK_ACCOUNT}`,
  {
    env: ALLIANCEBOOK_ACCOUNT_ENV,
    bucketName: "alliancebook.mattb.tech-terraform-state",
  }
);
