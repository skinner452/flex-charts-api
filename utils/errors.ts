import { Response } from "express";
import { StatusCodes } from "http-status-codes";

// Sends a 500 Internal Server Error response with a generic error message and logs the provided content
export const internalError = (res: Response, logContent?: any) => {
  console.error(logContent);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: "An error occurred",
  });
};
