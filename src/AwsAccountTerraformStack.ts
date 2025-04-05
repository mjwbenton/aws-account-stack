import { Stack, StackProps } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

type AwsAccountTerraformStackProps = StackProps & {
  bucketName: string;
};

export class AwsAccountTerraformStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: AwsAccountTerraformStackProps
  ) {
    super(scope, id, props);

    new Bucket(this, "TerraformStateBucket", {
      bucketName: props.bucketName,
      versioned: true,
    });
  }
}
