import { Router } from "express";
import { getUser } from "../domains/users";
import { internalError } from "../utils/errors";
import { StatusCodes } from "http-status-codes";
import { body, validationResult } from "express-validator";
import { createWorkout, getWorkout, getWorkouts } from "../domains/workouts";
import { WorkoutCreate } from "../types/workouts";
import { getExercise } from "../domains/exercises";
import { getSession } from "../domains/sessions";

const workoutsRouter = Router();

workoutsRouter.get("/", async (req, res): Promise<any> => {
  try {
    const { user, errRes } = await getUser(req, res);
    if (errRes) return errRes;

    const workouts = await getWorkouts(user.id);
    return res.json(workouts);
  } catch (err) {
    return internalError(res, err);
  }
});

workoutsRouter.post(
  "/",
  [
    body("sessionID").isInt(), // Aligned with the WorkoutCreate type
    body("exerciseID").isInt(),
    body("reps").isInt(),
    body("weight").isInt(),
  ],
  async (req, res): Promise<any> => {
    try {
      const { user, errRes } = await getUser(req, res);
      if (errRes) return errRes;

      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: validationErrors.array(),
        });
      }

      const validatedBody = req.body as WorkoutCreate;

      if (getSession(validatedBody.sessionID, user.id) === null) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: "Session does not belong to user",
        });
      }

      if (getExercise(validatedBody.exerciseID, user.id) === null) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: "Exercise does not belong to user",
        });
      }

      const workoutID = await createWorkout(user.id, validatedBody);
      const workout = await getWorkout(workoutID, user.id);
      return res.json(workout);
    } catch (err) {
      return internalError(res, err);
    }
  }
);

export default workoutsRouter;
