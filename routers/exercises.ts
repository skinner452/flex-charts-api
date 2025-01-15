import { Router } from "express";
import { getUser } from "../domains/users";
import { internalError } from "../utils/errors";
import { StatusCodes } from "http-status-codes";
import { body, param, validationResult } from "express-validator";
import {
  createExercise,
  deleteExercise,
  getExercise,
  getExercises,
} from "../domains/exercises";
import { ExerciseCreate } from "../types/exercises";
import { getExerciseStats } from "../domains/exercise_stats";

const exercisesRouter = Router();

exercisesRouter.get("/", async (req, res): Promise<any> => {
  try {
    const { user, errRes } = await getUser(req, res);
    if (errRes) return errRes;

    const exercises = await getExercises(user.id);
    return res.json(exercises);
  } catch (err) {
    return internalError(res, err);
  }
});

exercisesRouter.get("/:id", async (req, res): Promise<any> => {
  try {
    const { user, errRes } = await getUser(req, res);
    if (errRes) return errRes;

    const { id: idStr } = req.params;
    const id = parseInt(idStr, 10);

    const exercise = await getExercise(id, user.id);
    if (!exercise) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Exercise not found",
      });
    }

    return res.json(exercise);
  } catch (err) {
    return internalError(res, err);
  }
});

exercisesRouter.get(
  "/:id/stats",
  param("id").isInt(),
  async (req: any, res): Promise<any> => {
    try {
      const { user, errRes } = await getUser(req, res);
      if (errRes) return errRes;

      const { id: idStr } = req.params;
      const id = parseInt(idStr, 10);

      const exercise = await getExercise(id, user.id);
      if (!exercise) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: "Exercise not found",
        });
      }

      const stats = await getExerciseStats(id, exercise.exercise_type_id);
      return res.json(stats);
    } catch (err) {
      return internalError(res, err);
    }
  }
);

exercisesRouter.post(
  "/",
  [body("name").isString().notEmpty()], // Aligned with the ExerciseCreate type
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

      const validatedBody = req.body as ExerciseCreate;

      const exerciseID = await createExercise(validatedBody, user.id);
      const exercise = await getExercise(exerciseID, user.id);
      return res.json(exercise);
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(StatusCodes.CONFLICT).json({
          error: "Name already exists",
        });
      }
      return internalError(res, err);
    }
  }
);

exercisesRouter.delete("/:id", async (req, res): Promise<any> => {
  try {
    const { user, errRes } = await getUser(req, res);
    if (errRes) return errRes;

    const { id: idStr } = req.params;
    const id = parseInt(idStr, 10);

    const exercise = await getExercise(id, user.id);
    if (!exercise) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Exercise not found",
      });
    }

    await deleteExercise(id);
    return res.send();
  } catch (err) {
    return internalError(res, err);
  }
});

export default exercisesRouter;
