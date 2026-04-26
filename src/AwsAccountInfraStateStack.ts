import { Stack, StackProps } from "aws-cdk-lib";
import { AccountPrincipal } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

type AwsAccountInfraStateStackProps = StackProps & {
  bucketName: string;
  trustAccountIds?: string[];
};

export class AwsAccountInfraStateStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: AwsAccountInfraStateStackProps
  ) {
    super(scope, id, props);

    // NOTE: named TerraformStateBucket for backwards compat – also used for Pulumi state etc.
    const bucket = new Bucket(this, "TerraformStateBucket", {
      bucketName: props.bucketName,
      versioned: true,
    });
    (props.trustAccountIds ?? []).forEach((accountId) =>
      bucket.grantReadWrite(new AccountPrincipal(accountId))
    );
  }
}
