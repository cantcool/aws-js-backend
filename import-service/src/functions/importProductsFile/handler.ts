import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as dotenv from "dotenv";
dotenv.config();

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";

const SIGNED_EXPIRATION_SEC = 60 * 3;

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  console.log("importProductsFile", event);
  const { queryStringParameters } = event;
  const { name } = queryStringParameters;

  const s3Client = new S3Client({
    region: process.env.S3_AWS_REGION,
  });
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `uploaded/${name}`,
  });

  const preSignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: SIGNED_EXPIRATION_SEC,
  });

  return formatJSONResponse({
    url: preSignedUrl,
  });
};

export const main = middyfy(importProductsFile);
