import { App } from "aws-cdk-lib";
import { AwsAccountGithubStack } from "./AwsAccountGithubStack";
import { AwsAccountIdentityCenterStack } from "./AwsAccountIdentityCenterStack";
import { AwsAccountRolesStack } from "./AwsAccountRolesStack";
import { AwsAccountInfraStateStack } from "./AwsAccountInfraStateStack";
import {
  ALLIANCEBOOK_ACCOUNT,
  FILMBUDDY_ACCOUNT,
  MANAGEMENT_ACCOUNT,
} from "./accounts";
import { AwsSSOStack } from "./AwsSSOStack";

const MANAGEMENT_ACCOUNT_ENV = {
  account: MANAGEMENT_ACCOUNT,
  region: "us-east-1",
};

const ALLIANCEBOOK_ACCOUNT_ENV = {
  account: ALLIANCEBOOK_ACCOUNT,
  region: "us-east-1",
};

const FILMBUDDY_ACCOUNT_ENV = {
  account: FILMBUDDY_ACCOUNT,
  region: "us-east-1",
};

const app = new App();

// Management Account
new AwsAccountIdentityCenterStack(app, "AwsAccountIdentityCenter", {
  env: MANAGEMENT_ACCOUNT_ENV,
});
new AwsAccountGithubStack(app, "AwsAccountGithub", {
  env: MANAGEMENT_ACCOUNT_ENV,
  assumeAccountIds: [ALLIANCEBOOK_ACCOUNT, FILMBUDDY_ACCOUNT],
});
new AwsAccountRolesStack(app, "AwsAccountRoles", {
  env: MANAGEMENT_ACCOUNT_ENV,
});
new AwsAccountInfraStateStack(app, "AwsAccountTerraform", {
  env: MANAGEMENT_ACCOUNT_ENV,
  bucketName: "mattb.tech-terraform-state",
});
new AwsSSOStack(app, "AwsSSO", {
  env: MANAGEMENT_ACCOUNT_ENV,
  shareAccountIds: [ALLIANCEBOOK_ACCOUNT],
  callbackUrls: ["https://lonesome.mattb.tech", "https://alliance.mattb.tech"],
});

// AllianceBook Account
new AwsAccountRolesStack(app, `AwsAccountRoles-${ALLIANCEBOOK_ACCOUNT}`, {
  env: ALLIANCEBOOK_ACCOUNT_ENV,
  trustAccountIds: [MANAGEMENT_ACCOUNT],
});
new AwsAccountInfraStateStack(
  app,
  `AwsAccountTerraform-${ALLIANCEBOOK_ACCOUNT}`,
  {
    env: ALLIANCEBOOK_ACCOUNT_ENV,
    bucketName: "alliancebook.mattb.tech-terraform-state",
  }
);

// FilmBuddy Account
new AwsAccountRolesStack(app, `AwsAccountRoles-${FILMBUDDY_ACCOUNT}`, {
  env: FILMBUDDY_ACCOUNT_ENV,
  trustAccountIds: [MANAGEMENT_ACCOUNT],
});
new AwsAccountInfraStateStack(
  app,
  `AwsAccountInfraState-${FILMBUDDY_ACCOUNT}`,
  {
    env: FILMBUDDY_ACCOUNT_ENV,
    bucketName: "filmbuddy.mattb.tech-infra-state",
    trustAccountIds: [MANAGEMENT_ACCOUNT],
  }
);
