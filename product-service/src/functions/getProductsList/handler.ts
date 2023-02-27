import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { products } from "@mocks/products";
import { productsListSchema } from "@schemas/index";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  typeof productsListSchema
> = async () => {
  return formatJSONResponse(products);
};

export const main = middyfy(getProductsList);
