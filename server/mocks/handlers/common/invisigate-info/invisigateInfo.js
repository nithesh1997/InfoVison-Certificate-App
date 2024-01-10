import { rest } from "msw";
import { payload } from "./payload";

export function invisigateInfo() {
  const URL = `/${import.meta.env.VITE_BASE_API_PATH}/invisigate-info`;

  return rest.get(URL, (req, res, ctx) => {
    const id = req.url.search.replace("?", "");
    const responsePayload = payload.filter((info) => `${info.id}` === id)[0];

    return res(ctx.delay(0), ctx.status(200), ctx.json(responsePayload));
  });
}
