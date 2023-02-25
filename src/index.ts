import { App } from "aws-cdk-lib";
import { AwsAccountStack } from "./AwsAccountStack";

const app = new App();

new AwsAccountStack(app, "AwsAccountStack");
