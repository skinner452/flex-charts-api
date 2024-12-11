import { Request, Response } from "express";
import AWS from "aws-sdk";
import { StatusCodes } from "http-status-codes";
import { internalError } from "../utils/errors";

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
});

type User = {
  id: string;
};

// This is a really useful type so that we can check if there is an error, and if not, TS knows that the user is defined
type GetUserResponse =
  | {
      user: User;
      errRes?: undefined;
    }
  | {
      user?: undefined;
      errRes: Response;
    };

export const getUser = async (
  req: Request,
  res: Response
): Promise<GetUserResponse> => {
  const token = req.headers.authorization;
  if (!token) {
    return {
      errRes: res.status(StatusCodes.UNAUTHORIZED).json({
        error: "No token provided",
      }),
    };
  }

  try {
    const data = await cognito.getUser({ AccessToken: token }).promise();
    const userID = data.UserAttributes.find(
      (attr: any) => attr.Name === "sub"
    )?.Value;
    if (!userID) {
      return {
        errRes: internalError(res, "No ID found in UserAttributes"),
      };
    }

    const user = {
      id: userID,
    };
    return { user };
  } catch {
    return {
      errRes: res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Invalid token",
      }),
    };
  }
};
