import { Router } from "express";
import { DB } from "../utils/db";
import { getUser } from "../utils/auth";
import { internalError } from "../utils/errors";
import { StatusCodes } from "http-status-codes";

const machinesRouter = Router();

machinesRouter.get("/", async (req, res, next): Promise<any> => {
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

machinesRouter.post("/", async (req, res, next): Promise<any> => {
  try {
    const { user, errRes } = await getUser(req, res);
    if (errRes) return errRes;

    const { name } = req.body;
    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Name is required",
      });
    }

    await DB.query("INSERT INTO machines (name, user_id) VALUES (?, ?)", [
      name,
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
});

machinesRouter.delete("/:id", async (req, res, next): Promise<any> => {
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
