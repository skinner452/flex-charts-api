import { Router } from "express";
import { getUser } from "../domains/users";
import { internalError } from "../utils/errors";
import { StatusCodes } from "http-status-codes";
import { body, validationResult } from "express-validator";
import { createSet, getSets } from "../domains/sets";
import { SetCreate } from "../types/sets";
import { getMachine } from "../domains/machines";
import { getSession } from "../domains/sessions";

const setsRouter = Router();

setsRouter.get("/", async (req, res): Promise<any> => {
  try {
    const { user, errRes } = await getUser(req, res);
    if (errRes) return errRes;

    const sets = await getSets(user.id);
    return res.json(sets);
  } catch (err) {
    return internalError(res, err);
  }
});

setsRouter.post(
  "/",
  [
    body("sessionID").isInt(), // Aligned with the SetCreate type
    body("machineID").isInt(),
    body("reps").isInt(),
    body("weight").isInt(),
    body("datetime").isISO8601(),
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

      const validatedBody = req.body as SetCreate;

      if (getSession(validatedBody.sessionID, user.id) === null) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: "Session does not belong to user",
        });
      }

      if (getMachine(validatedBody.machineID, user.id) === null) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: "Machine does not belong to user",
        });
      }

      await createSet(user.id, validatedBody);
      return res.status(StatusCodes.CREATED).send();
    } catch (err) {
      return internalError(res, err);
    }
  }
);

export default setsRouter;
