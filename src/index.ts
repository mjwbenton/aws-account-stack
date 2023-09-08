import { App } from "aws-cdk-lib";
import { AwsAccountGithubStack } from "./AwsAccountGithubStack";
import { AwsAccountIdentityCenterStack } from "./AwsAccountIdentityCenterStack";
import { AwsAccountRolesStack } from "./AwsAccountRolesStack";
import { AwsAccountTerraformStack } from "./AwsAccountTerraformStack";

const app = new App();

new AwsAccountGithubStack(app, "AwsAccountGithub");
new AwsAccountIdentityCenterStack(app, "AwsAccountIdentityCenter");
new AwsAccountRolesStack(app, "AwsAccountRoles");
new AwsAccountTerraformStack(app, "AwsAccountTerraform");
