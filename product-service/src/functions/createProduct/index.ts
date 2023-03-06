import { handlerPath } from "@libs/handler-resolver";
import { productSchema } from "@schemas/index";
import documentation from "./documentation";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "products",
        cors: true,
        documentation,
        request: {
          schemas: {
            "application/json": productSchema,
          },
        },
      },
    },
  ],
};
