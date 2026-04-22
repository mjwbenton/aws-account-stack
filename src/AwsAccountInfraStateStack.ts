import { Stack, StackProps } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

type AwsAccountInfraStateStackProps = StackProps & {
  bucketName: string;
};

export class AwsAccountInfraStateStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: AwsAccountInfraStateStackProps
  ) {
    super(scope, id, props);

    new Bucket(this, "TerraformStateBucket", {
      bucketName: props.bucketName,
      versioned: true,
    });
  }
}
