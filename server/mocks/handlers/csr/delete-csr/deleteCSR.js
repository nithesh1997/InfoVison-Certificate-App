import { rest } from "msw";

export function deleteCSR() {
  const URL = `/${import.meta.env.VITE_BASE_API_PATH}/csr`;

  return rest.delete(URL, (req, res, ctx) => {
    const id = req.url.search.replace("?", "");

    return res(ctx.delay(0), ctx.status(200), ctx.json());
  });
}
