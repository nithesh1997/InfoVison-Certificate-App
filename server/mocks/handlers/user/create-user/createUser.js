import { rest } from "msw";
import { payload } from "./payload";

export function createUser() {
  const URL = `/${import.meta.env.VITE_BASE_API_PATH}/users`;

  return rest.post(URL, (req, res, ctx) => {
    const { password, ...requestPayload } = req.json();

    const successResponse = {
      id: Math.random().toString(16).slice(2),
    };

    return res(
      ctx.delay(1000),
      ctx.status(201),
      ctx.json(successResponse),
    );
  });
}
