import { handlerPath } from "@libs/handler-resolver";
import * as dotenv from "dotenv";
import { FOLDER_UPLOADED } from "./constants";

dotenv.config();

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: `${process.env.S3_BUCKET_NAME}`,
        event: "s3:ObjectCreated:*",
        existing: true,
        rules: [
          {
            prefix: `${FOLDER_UPLOADED}/`,
          },
          {
            suffix: ".csv",
          },
        ],
      },
    },
  ],
};
