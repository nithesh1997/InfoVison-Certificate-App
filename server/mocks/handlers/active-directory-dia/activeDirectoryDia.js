import { rest } from "msw";
import { handleArrayBuffer } from "server/utils/handleArrayBuffer";
import { payload } from "./payload";

export function activeDirectoryDia() {
  const URL = `/${
    import.meta.env.VITE_BASE_API_PATH
  }/certificate/download/activedirectorydia`;

  return rest.post(URL, (req, res, ctx) => {
    const { customerName, fqdn, csr } = handleArrayBuffer(req);

    return res(ctx.status(200), ctx.json(payload));
  });
}
