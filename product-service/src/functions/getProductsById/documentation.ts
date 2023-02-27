const documentation = {
  summary: "products/{productId}",
  description: "Returns a product by its ID",
  pathParams: [
    {
      name: "productId",
      description: "The product ID",
      schema: {
        type: "string",
        pattern: "^[-a-z0-9_]+$",
      },
      required: true,
      example: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
    },
  ],
  methodResponses: [
    {
      statusCode: 200,
      responseBody: {
        description: "A product object",
      },
    },
    {
      statusCode: 404,
      responseBody: {
        description: "An error message no product found",
      },
    },
  ],
};

export default documentation;
