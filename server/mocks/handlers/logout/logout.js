import { rest } from "msw";
import { payload } from "./payload";

export function logout() {
  const URL = `/${import.meta.env.VITE_BASE_API_PATH}/users/logout`;

  return rest.post(URL, (req, res, ctx) => {
    return res(ctx.delay(500), ctx.status(200), ctx.json(payload[0]));
  });
}
