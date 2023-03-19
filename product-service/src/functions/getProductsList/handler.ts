import { getProducts } from "@db/ddb_getProducts.js";
import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { productsListSchema } from "@schemas/index";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  typeof productsListSchema
> = async () => {
  console.log("getProductsList");

  try {
    const products = await getProducts();
    console.log("Success");
    console.log(products);
    return formatJSONResponse(products);
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

export const main = middyfy(getProductsList);
