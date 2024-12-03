import { Request, Response } from "express";
import AWS from "aws-sdk";
import { StatusCodes } from "http-status-codes";
import { internalError } from "./errors";

const cognito = new AWS.CognitoIdentityServiceProvider();

type User = {
  id: string;
};

type GetUserResponse = {
  user?: User;
  errRes?: Response;
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
