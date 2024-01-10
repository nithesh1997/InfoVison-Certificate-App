import { rest } from "msw";
import { payload } from "./payload";

export function updateCSR() {
  const URL = `/${import.meta.env.VITE_BASE_API_PATH}/csr/:id`;

  return rest.put(URL, (req, res, ctx) => {
    // const id = req.url.search.replace("?", "");
    // const requestPayload = req.json();

    return res(ctx.delay(0), ctx.status(200), ctx.json(payload.success));
  });
}
