import productSchema from "./productSchema";

export default {
  type: "array",
  items: productSchema,
} as const;
