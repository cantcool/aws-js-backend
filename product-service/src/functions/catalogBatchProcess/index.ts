import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    SNS_TOPIC_ARN: { "Fn::GetAtt": ["createProductTopic", "TopicArn"] },
  },
  events: [
    {
      sqs: {
        arn: { "Fn::GetAtt": ["catalogItemsQueue", "Arn"] },
        batchSize: 5,
        functionResponseType:
          "ReportBatchItemFailures" as "ReportBatchItemFailures",
      },
    },
  ],
};
