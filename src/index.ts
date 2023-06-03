import { App } from "aws-cdk-lib";
import { AwsAccountGithubStack } from "./AwsAccountGithubStack";
import { AwsAccountIdentityCenterStack } from "./AwsAccountIdentityCenterStack";

const app = new App();

new AwsAccountGithubStack(app, "AwsAccountGithub");
new AwsAccountIdentityCenterStack(app, "AwsAccountIdentityCenter");
