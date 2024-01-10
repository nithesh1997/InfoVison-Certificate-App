import { rest } from "msw";
import { payload } from "./payload";

export function getCSR() {
  const URL = `/${import.meta.env.VITE_BASE_API_PATH}/csr`;

  return rest.get(URL, async (req, res, ctx) => {
    return res(ctx.delay(0), ctx.status(200), ctx.json(payload.success));
  });
}
