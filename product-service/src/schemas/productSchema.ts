export default {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    img: { type: "string" },
    price: { type: "number" },
  },
  required: ["id", "title", "description", "price", "img"],
} as const;
