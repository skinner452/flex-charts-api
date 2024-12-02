import { APIGatewayEvent, Handler } from "aws-lambda";
import { Response } from "./responses";

export type LambdaHandler = Handler<APIGatewayEvent, Response>;
