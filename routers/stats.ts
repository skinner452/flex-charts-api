import { Router } from "express";
import { getUser } from "../domains/users";
import { internalError } from "../utils/errors";
import { query, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { getWeeklyStats } from "../domains/stats";
import { WeeklyStatsParams } from "../types/stats";

const statsRouter = Router();

statsRouter.get(
  "/weekly",
  query("weekStart").isISO8601(),
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

      const queryParams = req.query as WeeklyStatsParams;

      const weekStart = new Date(queryParams.weekStart);
      const weeklyStats = await getWeeklyStats(user.id, weekStart);
      return res.json(weeklyStats);
    } catch (err) {
      return internalError(res, err);
    }
  }
);

export default statsRouter;
