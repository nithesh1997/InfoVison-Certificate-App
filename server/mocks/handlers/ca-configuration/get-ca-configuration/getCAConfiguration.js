import { rest } from "msw";
import { payload } from "./payload";

export function getCAConfiguration() {
  const URL = `/${import.meta.env.VITE_BASE_API_PATH}/certificateconfig`;

  return rest.get(URL, (req, res, ctx) => {
    return res(ctx.delay(3000), ctx.status(200), ctx.json(payload.success));
  });
}
