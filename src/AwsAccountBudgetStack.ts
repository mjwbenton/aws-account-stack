import { Stack, StackProps } from "aws-cdk-lib";
import { CfnBudget } from "aws-cdk-lib/aws-budgets";
import { Construct } from "constructs";
import { env } from "./env";

const ACTUAL_THRESHOLDS = [50, 100];
const FORECASTED_THRESHOLDS = [100];

type AwsAccountBudgetStackProps = StackProps & {
  // The monthly budget for this account, in USD.
  monthlyBudgetUsd: number;
};

export class AwsAccountBudgetStack extends Stack {
  constructor(scope: Construct, id: string, props: AwsAccountBudgetStackProps) {
    super(scope, id, props);

    const subscriber: CfnBudget.SubscriberProperty = {
      subscriptionType: "EMAIL",
      address: env.BUDGET_ALERT_EMAIL,
    };

    const notifications: CfnBudget.NotificationWithSubscribersProperty[] = [
      ...ACTUAL_THRESHOLDS.map((threshold) => ({
        notification: {
          comparisonOperator: "GREATER_THAN",
          notificationType: "ACTUAL",
          threshold,
          thresholdType: "PERCENTAGE",
        },
        subscribers: [subscriber],
      })),
      ...FORECASTED_THRESHOLDS.map((threshold) => ({
        notification: {
          comparisonOperator: "GREATER_THAN",
          notificationType: "FORECASTED",
          threshold,
          thresholdType: "PERCENTAGE",
        },
        subscribers: [subscriber],
      })),
    ];

    new CfnBudget(this, "MonthlyBudget", {
      budget: {
        budgetName: `monthly-${this.account}`,
        budgetType: "COST",
        timeUnit: "MONTHLY",
        budgetLimit: {
          amount: props.monthlyBudgetUsd,
          unit: "USD",
        },
      },
      notificationsWithSubscribers: notifications,
    });
  }
}
