import { rest } from "msw";
import { payload } from "./payload";

export function createCSR() {
  const URL = `/${import.meta.env.VITE_BASE_API_PATH}/csr`;

  return rest.post(URL, (req, res, ctx) => {
    const requestPayload = req.json();

    return res(ctx.delay(0), ctx.status(201), ctx.json(payload.success));
  });
}
