import { rest } from "msw";
import { payload } from "./payload";

export function createCAConfiguration() {
  const URL = `/${import.meta.env.VITE_BASE_API_PATH}/certificateconfig`;

  return rest.post(URL, (req, res, ctx) => {
    return res(ctx.delay(0), ctx.status(200), ctx.json(payload.success));
  });
}
