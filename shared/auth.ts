import { APIGatewayEvent } from "aws-lambda";
import AWS from "aws-sdk";
import { InternalError, Response, Unauthorized } from "./responses";

const Cognito = new AWS.CognitoIdentityServiceProvider();

type Auth = {
  userID: string;
  errorResponse: Response | null;
};

export const GetAuth = async (event: APIGatewayEvent): Promise<Auth> => {
  // Get the token from the Authorization header
  const token = event.headers.Authorization;
  if (!token) {
    return {
      userID: "",
      errorResponse: Unauthorized("No token provided"),
    };
  }

  try {
    // Fetch user information
    const data = await Cognito.getUser({ AccessToken: token }).promise();
    const userID = data.UserAttributes.find(
      (attr) => attr.Name === "sub"
    )?.Value;
    if (!userID) {
      return {
        userID: "",
        errorResponse: InternalError("No ID found in user attributes"),
      };
    }
    return { userID, errorResponse: null };
  } catch (err) {
    return {
      userID: "",
      errorResponse: Unauthorized("Invalid token"),
    };
  }
};
