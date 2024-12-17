import { Router } from "express";
import { getUser } from "../domains/users";
import { internalError } from "../utils/errors";
import { StatusCodes } from "http-status-codes";
import { param, validationResult, query } from "express-validator";
import { createSession, deleteSession, getSessions } from "../domains/sessions";
import { SessionFilters } from "../types/sessions";
import { parseBool } from "../utils/parseBool";

const sessionsRouter = Router();

sessionsRouter.get(
  "/",
  query("isActive").isBoolean().optional(),
  async (req: any, res): Promise<any> => {
    try {
      const { user, errRes } = await getUser(req, res);
      if (errRes) return errRes;

      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: validationErrors.array(),
        });
      }

      const filters = {
        isActive: parseBool(req.query.isActive),
      } as SessionFilters;

      const sessions = await getSessions(user.id, filters);
      return res.json(sessions);
    } catch (err) {
      return internalError(res, err);
    }
  }
);

sessionsRouter.post("/", async (req, res): Promise<any> => {
  try {
    const { user, errRes } = await getUser(req, res);
    if (errRes) return errRes;

    await createSession(user.id);
    return res.status(StatusCodes.CREATED).send();
  } catch (err) {
    return internalError(res, err);
  }
});

sessionsRouter.delete(
  "/:id",
  param("id").isInt(),
  async (req: any, res): Promise<any> => {
    try {
      const { user, errRes } = await getUser(req, res);
      if (errRes) return errRes;

      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: validationErrors.array(),
        });
      }

      const { id: idStr } = req.params;
      const id = parseInt(idStr, 10);

      await deleteSession(id, user.id);
      return res.send();
    } catch (err) {
      return internalError(res, err);
    }
  }
);

export default sessionsRouter;
