import { rest } from "msw";
import { payload } from "./payload";

export function addInvisigate() {
  const URL = `/${import.meta.env.VITE_BASE_API_PATH}/invisigate-info`;

  return rest.post(URL, (req, res, ctx) => {
    return res(
      ctx.delay(0),
      ctx.status(200),
      ctx.json({
        data: {
          ...req.json(),
          id: Math.random(2).toString(16).slice(2),
        },
      }),
    );
  });
}
