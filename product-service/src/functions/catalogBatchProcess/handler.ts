import { SQSEvent } from "aws-lambda";
import {
  PublishCommand,
  PublishCommandInput,
  SNSClient,
} from "@aws-sdk/client-sns";

import { putProduct } from "@db/ddb_putProduct";

const snsClient = new SNSClient({});

const putProductsToDB = async (products) => {
  console.log("putProductsToDB input", products);
  const results = await Promise.all(
    products.map((product) => putProduct(product))
  );

  return results;
};

const notifyAboutProduct = async (product) => {
  const publishInput: PublishCommandInput = {
    TopicArn: process.env.SNS_TOPIC_ARN,
    Subject: "Product imported summary",
    Message: `Item was imported: ${JSON.stringify(product)}`,
    MessageAttributes: {
      titleSplit: {
        DataType: "String.Array",
        StringValue: JSON.stringify(
          product.title.split(" ").map((titlePart) => titlePart.toLowerCase())
        ),
      },
    },
  };

  const publishResult = await snsClient.send(new PublishCommand(publishInput));

  return publishResult;
};

const sendNotifications = async (products: any[]) => {
  const snsPublishResult = await Promise.all(
    products.map((product) => notifyAboutProduct(product))
  );

  return snsPublishResult;
};

const catalogBatchProcess = async (event: SQSEvent): Promise<void> => {
  console.log("catalogBatchProcess Records", event.Records);
  const products = event.Records.map((item) => JSON.parse(item.body));
  console.log("products", products);

  try {
    const putResults = await putProductsToDB(products);
    console.log("catalogBatchProcess putResults", putResults);
  } catch (e) {
    console.error("putResults error", e);
  }

  try {
    const notificationsResult = await sendNotifications(products);
    console.log("catalogBatchProcess notificationsResult", notificationsResult);
  } catch (e) {
    console.error("notificationsResult error", e);
  }
};

export const main = catalogBatchProcess;
