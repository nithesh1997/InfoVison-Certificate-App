import { rest } from "msw";
import { payload } from "./payload";

export function updateCAConfiguration() {
  const URL = `/${import.meta.env.VITE_BASE_API_PATH}/certificateconfig/:id`;

  return rest.put(URL, async (req, res, ctx) => {
    const requestPayload = await req.json();
    console.log(requestPayload);

    const responsePayload = { id: payload.success.id, ...requestPayload };

    return res(ctx.delay(0), ctx.status(200), ctx.json(responsePayload));
  });
}
