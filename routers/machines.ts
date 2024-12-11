import { Router } from "express";
import { DB } from "../utils/db";
import { getUser } from "../utils/auth";
import { internalError } from "../utils/errors";
import { StatusCodes } from "http-status-codes";
import { body, validationResult } from "express-validator";

const machinesRouter = Router();

machinesRouter.get("/", async (req, res): Promise<any> => {
  try {
    const { user, errRes } = await getUser(req, res);
    if (errRes) return errRes;

    const [rows] = await DB.query(
      "SELECT id, name FROM machines WHERE user_id = ?",
      [user?.id]
    );
    return res.json(rows);
  } catch (err) {
    return internalError(res, err);
  }
});

type MachinesPostRequest = {
  name: string;
};
machinesRouter.post(
  "/",
  [body("name").isString()],
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

      const validatedBody = req.body as MachinesPostRequest;

      await DB.execute("INSERT INTO machines (name, user_id) VALUES (?, ?)", [
        validatedBody.name,
        user?.id,
      ]);
      return res.status(StatusCodes.CREATED).send();
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

machinesRouter.delete("/:id", async (req, res): Promise<any> => {
  try {
    const { user, errRes } = await getUser(req, res);
    if (errRes) return errRes;

    const { id } = req.params;
    await DB.query("DELETE FROM machines WHERE id = ? AND user_id = ?", [
      id,
      user?.id,
    ]);
    return res.send();
  } catch (err) {
    return internalError(res, err);
  }
});

export default machinesRouter;
