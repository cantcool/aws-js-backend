import type { AWS } from "@serverless/typescript";

import * as FCs from "@functions/index";

const serverlessConfiguration: AWS = {
  service: "product-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-openapi-documenter"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "eu-central-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    documentation: {
      version: "1.0.0",
      title: "AWS product-service API",
      description: "product-service (Viachaslau Tsimoshchanka)",
      servers: [
        {
          url: "https://0ove44vgh5.execute-api.eu-central-1.amazonaws.com/dev",
          description: "dev",
        },
        {
          url: "https://0ove44vgh5.execute-api.eu-central-1.amazonaws.com/",
          description: "prod",
        },
      ],
      models: [],
    },
  },
  functions: FCs,
};

module.exports = serverlessConfiguration;
