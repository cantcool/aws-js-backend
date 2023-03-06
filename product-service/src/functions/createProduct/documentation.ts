const documentation = {
  summary: "products",
  description: "Create a new product",
  requestBody: {
    content: {
      "application/json": {
        examples: {
          body: {
            summary: "An example of a product",
            value: {
              id: "12",
              description: "Monitor",
            },
          },
        },
      },
    },
  },
  methodResponses: [
    {
      statusCode: 200,
      responseBody: {
        description: "A product is created",
      },
    },
    {
      statusCode: 400,
      responseBody: {
        description: "A validation message",
      },
    },
    {
      statusCode: 500,
      responseBody: {
        description: "An error message",
      },
    },
  ],
};

export default documentation;
