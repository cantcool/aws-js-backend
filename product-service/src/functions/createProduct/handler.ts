import { putProduct } from "@db/ddb_putProduct";
import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { productSchema } from "@schemas/index";

const createProduct: ValidatedEventAPIGatewayProxyEvent<
  typeof productSchema
> = async (event) => {
  console.log("createProduct", JSON.stringify(event));

  try {
    const product = event.body;
    await putProduct(product);

    return formatJSONResponse({ message: "OK" }, 201);
  } catch (err) {
    console.error(JSON.stringify(err));

    if (err.name === "ValidationException") {
      return formatJSONResponse({ message: err.message }, 400);
    }

    return formatJSONResponse(
      {
        message: "An error occured",
      },
      500
    );
  }
};

export const main = middyfy(createProduct);
