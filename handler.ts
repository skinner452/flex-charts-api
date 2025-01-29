import serverless from "serverless-http";
import express from "express";
import { StatusCodes } from "http-status-codes";
import exercisesRouter from "./routers/exercises";
import workoutsRouter from "./routers/workouts";
import sessionsRouter from "./routers/sessions";
import statsRouter from "./routers/stats";

const app = express();

// Parse JSON request body
app.use(express.json());

// Attach routers
app.use("/exercises", exercisesRouter);
app.use("/workouts", workoutsRouter);
app.use("/sessions", sessionsRouter);
app.use("/stats", statsRouter);

// Unhandled routes should 404
app.use((_req, res): any => {
  return res.status(StatusCodes.NOT_FOUND).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
