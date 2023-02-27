import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { products } from "@mocks/products";
import { productSchema } from "@schemas/index";

const getProductsById: ValidatedEventAPIGatewayProxyEvent<
  typeof productSchema
> = async (event) => {
  const { productId } = event.pathParameters;
  const product = products.find((item) => item.id === productId);

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
};

export const main = middyfy(getProductsById);
