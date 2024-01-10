import { rest } from "msw";
import { payload } from "./payload";

export function invisigateList() {
  const URL = `/${import.meta.env.VITE_BASE_API_PATH}/invisigate-info/list`;

  return rest.get(URL, (req, res, ctx) => {
    return res(ctx.delay(0), ctx.status(200), ctx.json(payload));
  });
}
