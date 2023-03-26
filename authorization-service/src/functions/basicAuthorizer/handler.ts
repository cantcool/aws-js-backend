import { APIGatewayRequestAuthorizerEvent, PolicyDocument } from "aws-lambda";
import * as dotenv from "dotenv";

import { AuthEffect } from "./types";

dotenv.config();

export const generateResponsePolicy = (
  principalId,
  effect: AuthEffect,
  methodArn: string
) => {
  const policyDocument: PolicyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: methodArn,
      },
    ],
  };

  return {
    principalId,
    policyDocument,
  };
};

const basicAuthorizer = async (event: APIGatewayRequestAuthorizerEvent) => {
  console.log("basicAuthorizer", JSON.stringify(event));

  const { headers, methodArn } = event;
  const authorizationHeader = headers.Authorization;
  if (!authorizationHeader) {
    throw new Error("Unauthorized");
  }

  const claims = authorizationHeader.split(" ")[1];
  // console.log("claims");
  if (!claims) {
    throw new Error("Unauthorized");
  }

  const [username, password] = Buffer.from(claims, "base64")
    .toString()
    .split(":");
  // console.log("username, password", username, password);
  if (!username || !password) {
    throw new Error("Unauthorized");
  }

  const isValidPair = process.env[username] === password;
  // console.log("isValidPair", isValidPair);
  const responsePolicy = isValidPair
    ? generateResponsePolicy(username, AuthEffect.Allow, methodArn)
    : generateResponsePolicy(username, AuthEffect.Deny, methodArn);

  return responsePolicy;
};

export const main = basicAuthorizer;
