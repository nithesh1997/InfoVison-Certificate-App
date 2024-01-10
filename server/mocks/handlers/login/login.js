import { rest } from "msw";
import { handleArrayBuffer } from "server/utils/handleArrayBuffer";
import { payload } from "./payload";
import { isUserExist } from "./isUserExist";
import { isPasswordValid } from "./isPasswordValid";

export function login() {
  const URL = `/${import.meta.env.VITE_BASE_API_PATH}/users/login`;

  return rest.post(URL, async (req, res, ctx) => {
    const { username, password } = await handleArrayBuffer(req);

    const isUserNotExist = isUserExist(username, payload);
    const isPasswordNotValid = isPasswordValid(username, password, payload);

    if (isUserNotExist) {
      const delay = ctx.delay(0);
      const status = ctx.status(400);
      const json = ctx.json({ error: isUserNotExist });

      return res(delay, status, json);
    } else if (isPasswordNotValid) {
      const delay = ctx.delay(0);
      const status = ctx.status(400);
      const json = ctx.json({ error: isPasswordNotValid });

      return res(delay, status, json);
    } else {
      const profile = payload.filter(
        (profile) => profile.username === username,
      );

      return res(ctx.delay(0), ctx.status(200), ctx.json(...profile));
    }
  });
}
