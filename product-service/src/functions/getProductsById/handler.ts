import { getProductItem } from "@db/ddb_getProductItem.js";
import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { productSchema } from "@schemas/index";

const getProductsById: ValidatedEventAPIGatewayProxyEvent<
  typeof productSchema
> = async (event) => {
  console.log("getProductsById", JSON.stringify(event));
  try {
    const { productId } = event.pathParameters;
    const product = await getProductItem(productId);
    console.log("product", product);
    if (!product) {
      return formatJSONResponse(
        {
          message: "Product not found",
          productId,
        },
        404
      );
    }

    return formatJSONResponse(product);
  } catch (err) {
    console.log("Failure", err.message);
    return formatJSONResponse(
      {
        message: "An error occured",
      },
      500
    );
  }
};

export const main = middyfy(getProductsById);
