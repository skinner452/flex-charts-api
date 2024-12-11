import { Router } from "express";
import { getUser } from "../utils/auth";
import { internalError } from "../utils/errors";
import { StatusCodes } from "http-status-codes";
import { body, validationResult } from "express-validator";
import { DB } from "../utils/db";

const setsRouter = Router();

setsRouter.get("/", async (req, res): Promise<any> => {
  try {
    const { user, errRes } = await getUser(req, res);
    if (errRes) return errRes;

    const [rows] = await DB.query(
      `SELECT
        sets.id,
        sets.weight,
        sets.reps,
        sets.datetime,
        machines.id AS machine_id,
        machines.name AS machine_name
      FROM sets
      JOIN machines ON sets.machine_id = machines.id
      WHERE machines.user_id = ?`,
      [user?.id]
    );
    return res.json(rows);
  } catch (err) {
    return internalError(res, err);
  }
});

type SetsPostRequest = {
  machineID: number;
  reps: number;
  weight: number;
  datetime: Date;
};

setsRouter.post(
  "/",
  [
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

      const validatedBody = req.body as SetsPostRequest;

      // Verify that the machine belongs to the user
      const [rows] = await DB.query<any[]>(
        "SELECT id FROM machines WHERE user_id = ? AND id = ?",
        [user?.id, validatedBody.machineID]
      );
      if (rows.length === 0) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: "Machine does not belong to user",
        });
      }

      await DB.execute(
        "INSERT INTO sets (machine_id, weight, reps, datetime) VALUES (?, ?, ?, ?)",
        [
          validatedBody.machineID,
          validatedBody.weight,
          validatedBody.reps,
          validatedBody.datetime,
        ]
      );
      return res.status(StatusCodes.CREATED).send();
    } catch (err) {
      return internalError(res, err);
    }
  }
);

export default setsRouter;
