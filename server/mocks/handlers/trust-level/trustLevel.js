import { rest } from "msw";
import { handleArrayBuffer } from "server/utils/handleArrayBuffer";
import { payload } from "./payload";

export default function trustLevel() {
  const URL = `${window.location.origin}/certificate/download/trustLevel`;

  return rest.post(URL, (req, res, ctx) => {
    const { customerName, fqdn, csr } = handleArrayBuffer(req);

    return res(ctx.status(200), ctx.json(payload));
  });
}
