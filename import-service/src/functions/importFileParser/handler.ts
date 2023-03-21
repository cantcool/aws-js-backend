import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import * as dotenv from "dotenv";
import csv from "csv-parser";
import { FOLDER_UPLOADED, FOLDER_PARSED } from "./constants";

dotenv.config();

const sqsClient = new SQSClient({});

export const sendToQueue = async (record: any) => {
  console.log("sendToQueue input:", record);
  const productItem = {
    id: record.id,
    title: record.title,
    description: record.description,
    price: parseFloat(record.price),
    count: parseInt(record.count) || 0,
  };
  try {
    const sendResult = await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: process.env.SQS_URL,
        MessageBody: JSON.stringify(productItem),
      })
    );
    console.log("sendToQueue result:", sendResult);
  } catch (e) {
    console.error(e);
  }
};

const importFileParser = async (event) => {
  console.log("importFileParser", JSON.stringify(event));

  const client = new S3Client({
    region: process.env.S3_AWS_REGION,
  });
  const bucket = event.Records[0].s3.bucket.name;
  const folder = event.Records[0].s3.object.key.split("/")[0];
  const fileName = event.Records[0].s3.object.key.split("/")[1];
  if (folder !== FOLDER_UPLOADED) {
    console.error(`Not a ${FOLDER_UPLOADED} event, skipping`);
    return;
  }
  let key;
  let response;

  try {
    key = decodeURIComponent(
      event.Records[0].s3.object.key.replace(/\+/g, " ")
    );

    const input = {
      Bucket: bucket,
      Key: key,
    };
    const command = new GetObjectCommand(input);
    response = await client.send(command);
    console.log("response", response);

    if (response.ContentType !== "text/csv" || !response.Body) {
      console.error("Response is not a valid CSV");
      return;
    }
  } catch (error) {
    console.error("Getting Error: ", error);
  }

  try {
    const readableStream: ReadableStream = response.Body!;
    const parserFcn = new Promise((resolve, reject) => {
      readableStream
        .pipe(csv())
        .on("data", function (data) {
          sendToQueue(data);
        })
        .on("end", function () {
          resolve("CSV parse process finished");
        })
        .on("error", function () {
          reject("CSV parse process failed");
        });
    });
    await parserFcn;
  } catch (error) {
    console.error("Parsing Error: ", error);
  }

  try {
    const CopySource = encodeURI(`${bucket}/${folder}/${fileName}`);
    const PasteKey = encodeURI(`${FOLDER_PARSED}/${fileName}`);
    const copyCommand = new CopyObjectCommand({
      Bucket: bucket,
      CopySource,
      Key: PasteKey,
    });
    const copyResponse = await client.send(copyCommand);
    console.log("Copying:", copyResponse);
  } catch (error) {
    console.error("Copying Error: ", error);
  }

  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const deleteResponse = await client.send(deleteCommand);
    console.log("Deleting:", deleteResponse);
  } catch (error) {
    console.error("Deleting Error: ", error);
  }
};

export const main = importFileParser;
