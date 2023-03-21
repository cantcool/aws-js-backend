export const createProductTopic = {
  createProductTopic: {
    Type: "AWS::SNS::Topic",
  },
  EmailSubscriptionGeneral: {
    Type: "AWS::SNS::Subscription",
    Properties: {
      TopicArn: { "Fn::GetAtt": ["createProductTopic", "TopicArn"] },
      Protocol: "email",
      Endpoint: "vyachaslau@gmail.com",
    },
  },
  EmailSubscriptionAdamBrand: {
    Type: "AWS::SNS::Subscription",
    Properties: {
      FilterPolicyScope: "MessageAttributes",
      FilterPolicy: { titleSplit: ["adam"] },
      TopicArn: { "Fn::GetAtt": ["createProductTopic", "TopicArn"] },
      Protocol: "email",
      Endpoint: "vyachaslau+adam@gmail.com",
    },
  },
  EmailSubscriptionGenelecBrand: {
    Type: "AWS::SNS::Subscription",
    Properties: {
      FilterPolicyScope: "MessageAttributes",
      FilterPolicy: { titleSplit: ["genelec"] },
      TopicArn: { "Fn::GetAtt": ["createProductTopic", "TopicArn"] },
      Protocol: "email",
      Endpoint: "vyachaslau+genelec@gmail.com",
    },
  },
};
