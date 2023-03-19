/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0

ABOUT THIS NODE.JS EXAMPLE: This example works with the AWS SDK for JavaScript (v3),
which is available at https://github.com/aws/aws-sdk-js-v3. This example is in the 'AWS SDK for JavaScript v3 Developer Guide' at
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html.

Purpose:
ddb_putitem.js demonstrates how to create or replace an item in an Amazon DynamoDB table.

INPUTS:
- TABLE_NAME

Running the code:
node ddb_putitem.js
*/
// snippet-start:[dynamodb.JavaScript.item.putItemV3]

// Import required AWS SDK clients and commands for Node.js
import * as dotenv from "dotenv";
import { TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "./libs/ddbClient.js";

dotenv.config();

export const putProduct = async ({
  id,
  description,
  title,
  price,
  count = 0,
}) => {
  const productM = marshall({ id, description, title, price });
  const stockM = marshall({ product_id: id, count });
  const transaction = {
    ReturnConsumedCapacity: "INDEXES",
    ReturnItemCollectionMetrics: "SIZE",
    TransactItems: [
      {
        Put: {
          TableName: process.env.DB_PRODUCTS_NAME,
          Item: productM,
        },
      },
      {
        Put: {
          TableName: process.env.DB_STOCKS_NAME,
          Item: stockM,
        },
      },
    ],
  };
  const data = await ddbClient.send(new TransactWriteItemsCommand(transaction));

  return data;
};
