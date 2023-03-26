import { handlerPath } from "@libs/handler-resolver";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
};
