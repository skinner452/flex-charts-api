import { DB } from "./shared/db";
import { BadRequest, InternalError, Success } from "./shared/responses";
import { LambdaHandler } from "./shared/lambda";
import { GetAuth } from "./shared/auth";

export const handler: LambdaHandler = async (event) => {
  const auth = await GetAuth(event);
  if (auth.errorResponse) {
    return auth.errorResponse;
  }

  // GET /machines
  if (event.httpMethod === "GET") {
    try {
      const [rows] = await DB.query(
        "SELECT id, name FROM machines WHERE user_id = ?",
        [auth.userID]
      );
      return Success({
        machines: rows,
        userID: auth.userID,
      });
    } catch (err) {
      return InternalError(err);
    }
  }

  // POST /machines
  if (event.httpMethod === "POST") {
    try {
      const { name } = JSON.parse(event.body || "{}");
      if (!name) {
        return BadRequest("Missing required fields");
      }
      const [result] = await DB.query(
        "INSERT INTO machines (user_id, name) VALUES (?, ?)",
        [auth.userID, name]
      );
      return Success({ id: result["insertId"] });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return BadRequest("Machine already exists");
      }
      return InternalError(err);
    }
  }

  // DELETE /machines/{id}
  if (event.httpMethod === "DELETE") {
    const id = event.pathParameters?.id;
    if (!id) {
      return BadRequest("Missing required fields");
    }
    try {
      await DB.query("DELETE FROM machines WHERE id = ? AND user_id = ?", [
        id,
        auth.userID,
      ]);
      return Success();
    } catch (err) {
      return InternalError(err);
    }
  }

  return BadRequest("Invalid method");
};
