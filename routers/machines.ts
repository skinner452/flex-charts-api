import { Router } from "express";
import { getUser } from "../domains/users";
import { internalError } from "../utils/errors";
import { StatusCodes } from "http-status-codes";
import { body, param, validationResult } from "express-validator";
import {
  createMachine,
  deleteMachine,
  getMachine,
  getMachines,
} from "../domains/machines";
import { MachineCreate } from "../types/machines";

const machinesRouter = Router();

machinesRouter.get("/", async (req, res): Promise<any> => {
  try {
    const { user, errRes } = await getUser(req, res);
    if (errRes) return errRes;

    const machines = await getMachines(user.id);
    return res.json(machines);
  } catch (err) {
    return internalError(res, err);
  }
});

machinesRouter.post(
  "/",
  [body("name").isString()], // Aligned with the MachineCreate type
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

      const validatedBody = req.body as MachineCreate;

      const machineID = await createMachine(validatedBody, user.id);
      const machine = await getMachine(machineID, user.id);
      return res.json(machine);
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

machinesRouter.delete(
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

      await deleteMachine(id, user.id);
      return res.send();
    } catch (err) {
      return internalError(res, err);
    }
  }
);

export default machinesRouter;
