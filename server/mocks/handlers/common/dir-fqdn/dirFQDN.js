import { rest } from "msw";
import { payload } from "./payload";

export function dirFQDN() {
  const URL = `/invisipoint/dirFQDN`;

  return rest.get(URL, (req, res, ctx) => {
    const invisigateIp = req.url.searchParams.get("invisigateIp");

    return res(ctx.delay(0), ctx.status(200), ctx.json(payload.success));
  });
}
