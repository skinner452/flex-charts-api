import serverless from "serverless-http";
import express from "express";
import { StatusCodes } from "http-status-codes";
import machinesRouter from "./routers/machines";
import setsRouter from "./routers/sets";
import sessionsRouter from "./routers/sessions";

const app = express();

// Parse JSON request body
app.use(express.json());

// Attach routers
app.use("/machines", machinesRouter);
app.use("/sets", setsRouter);
app.use("/sessions", sessionsRouter);

// Unhandled routes should 404
app.use((_req, res, _next): any => {
  return res.status(StatusCodes.NOT_FOUND).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
