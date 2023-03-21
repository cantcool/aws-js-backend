export const catalogItemsQueue = {
  catalogItemsQueue: {
    Type: "AWS::SQS::Queue",
    Properties: {
      RedrivePolicy: {
        maxReceiveCount: 2,
        deadLetterTargetArn: {
          "Fn::GetAtt": ["catalogItemsQueueDLQ", "Arn"],
        },
      },
    },
  },
  catalogItemsQueueDLQ: {
    Type: "AWS::SQS::Queue",
  },
  catalogItemsQueuePath: {
    Type: "AWS::SSM::Parameter",
    Properties: {
      Name: "catalogItemsQueue",
      Type: "String",
      Value: { "Fn::GetAtt": ["catalogItemsQueue", "QueueUrl"] },
    },
  },
};
