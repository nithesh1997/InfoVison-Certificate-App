import { rest } from "msw";
import { payload } from "./payload";

export function deleteInvisigate() {
   const URL = `/${import.meta.env.VITE_BASE_API_PATH}/invisigate-info/:id`;
  return rest.delete(URL, (req, res, ctx) => {

    const id = req.url.search.replace("?", "");

    return res(ctx.delay(1000), ctx.status(200), ctx.json(payload));
  });
}
