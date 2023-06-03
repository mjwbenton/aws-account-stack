import { App } from "aws-cdk-lib";
import { AwsAccountGithubStack } from "./AwsAccountGithubStack";

const app = new App();

new AwsAccountGithubStack(app, "AwsAccountGithub");
