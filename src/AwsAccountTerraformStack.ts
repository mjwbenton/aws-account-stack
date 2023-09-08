import { Stack, StackProps } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class AwsAccountTerraformStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new Bucket(this, "TerraformStateBucket", {
      bucketName: "mattb.tech-terraform-state",
      versioned: true,
    });
  }
}
