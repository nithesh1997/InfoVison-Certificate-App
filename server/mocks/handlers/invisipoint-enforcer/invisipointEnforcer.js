import { rest } from "msw";
import { handleArrayBuffer } from "server/utils/handleArrayBuffer";
import { payload } from "./payload";

export function invisipointEnforcer() {
  const URL = `/${
    import.meta.env.VITE_BASE_API_PATH
  }/invisipoint/enforcer/download`;

  return rest.post(URL, async (req, res, ctx) => {
    const requestPayload = await handleArrayBuffer(req);

    return res(ctx.delay(3000), ctx.status(200), ctx.json({ ...payload }));
  });
}
