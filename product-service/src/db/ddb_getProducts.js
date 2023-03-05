/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0

ABOUT THIS NODE.JS EXAMPLE: This example works with the AWS SDK for JavaScript (v3),
which is available at https://github.com/aws/aws-sdk-js-v3. This example is in the 'AWS SDK for JavaScript v3 Developer Guide' at// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html.

Purpose:
ddb_getitem.js demonstrates how to retrieve the attributes of an item from an Amazon DynamoDB table.

INPUTS:
- TABLE_NAME
- KEY_NAME: the primary key of the table, e.g., 'CUSTOMER_ID'
- KEY_NAME_VALUE: the value of the primary key row containing the attribute value
- ATTRIBUTE_NAME: the name of the attribute column containing the attribute value

Running the code:
node ddb_getitem.js
*/
// snippet-start:[dynamodb.JavaScript.item.getItemV3]
// Import required AWS SDK clients and commands for Node.js
import * as dotenv from "dotenv";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "./libs/ddbClient.js";

dotenv.config();

export const getProducts = async () => {
  const productsParams = {
    TableName: process.env.DB_PRODUCTS_NAME,
  };
  const stocksParams = {
    TableName: process.env.DB_STOCKS_NAME,
  };

  const [products, stocks] = await Promise.all([
    ddbClient.send(new ScanCommand(productsParams)),
    ddbClient.send(new ScanCommand(stocksParams)),
  ]);

  const productItems = products.Items.map((product) => unmarshall(product));
  const countsMap = stocks.Items.map((stock) => unmarshall(stock)).reduce(
    (acc, item) => {
      acc[item.product_id] = item.count;
      return acc;
    },
    {}
  );

  const mappedProducts = productItems.map((product) => ({
    ...product,
    count: countsMap[product.id] || 0,
  }));

  console.log(productItems);
  console.log(countsMap);

  return mappedProducts;
};

// snippet-end:[dynamodb.JavaScript.item.getItemV3]
// For unit tests only.
// module.exports ={run, params};
