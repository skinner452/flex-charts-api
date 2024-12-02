export type Response = {
  statusCode: number;
  body?: string;
};

export const InternalError = (err: any): Response => {
  console.error("InternalError:", err);
  return {
    statusCode: 500,
    body: "Internal Server Error",
  };
};

export const NotFound = (): Response => {
  return {
    statusCode: 404,
    body: "Resource Not Found",
  };
};

export const BadRequest = (message: string): Response => {
  return {
    statusCode: 400,
    body: message,
  };
};

export const Unauthorized = (message?: string): Response => {
  return {
    statusCode: 401,
    body: "Unauthorized" + (message ? `: ${message}` : ""),
  };
};

export const Forbidden = (): Response => {
  return {
    statusCode: 403,
    body: "Forbidden",
  };
};

export const Success = (data?: any): Response => {
  return {
    statusCode: 200,
    body: data ? JSON.stringify(data) : undefined,
  };
};
