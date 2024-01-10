import { rest } from "msw";
import { payload } from "./payload";

export function deleteCAConfiguration() {
  const URL = `/${import.meta.env.VITE_BASE_API_PATH}/certificateconfig`;

  return rest.delete(URL, (req, res, ctx) => {
    return res(ctx.delay(0), ctx.status(204), ctx.json(payload.success));
  });
}
