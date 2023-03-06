import { marshall } from "@aws-sdk/util-dynamodb";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import * as dotenv from "dotenv";

import { ddbClient } from "./libs/ddbClient.js";
import products from "../product-service/src/mocks/products.js";

dotenv.config();

const fillItem = async (params) =>
  await ddbClient.send(new PutItemCommand(params));

const mapProduct = (product) => ({
  TableName: process.env.DB_PRODUCTS_NAME,
  Item: marshall(product),
});

const mapStock = ({ id }) => ({
  TableName: process.env.DB_STOCKS_NAME,
  Item: marshall({
    product_id: id,
    count: 2 + Math.round(Math.random() * 5),
  }),
});

try {
  await Promise.all([
    products.map((product) => fillItem(mapProduct(product))),
    products.map((product) => fillItem(mapStock(product))),
  ]);
  console.log("OK: Products were inserted");
} catch (err) {
  console.error(err);
}
