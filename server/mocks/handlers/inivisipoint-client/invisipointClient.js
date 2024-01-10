import { rest } from "msw";
import { handleArrayBuffer } from "server/utils/handleArrayBuffer";
import { payload } from "./payload";

export function invisipointClient() {
  const URL = `/${
    import.meta.env.VITE_BASE_API_PATH
  }/invisipoint/client/download`;

  return rest.post(URL, async (req, res, ctx) => {
    const requestPayload = await handleArrayBuffer(req);
    const customerName = requestPayload.customerName ?? "";
    const filename = `${customerName.toLocaleLowerCase()}.zip`;
    const file = new File([], filename, { type: "application/zip" });
    const fileBuffer = await file.arrayBuffer().then((buffer) => buffer);

    return res(
      ctx.delay(0),
      ctx.status(200),
      ctx.set("Content-Length", fileBuffer.byteLength.toString()),
      ctx.set("Content-Type", "application/octet-stream"),
      ctx.set("Content-Disposition", `attachment; filename=hello-friend.zip`),
      ctx.body(fileBuffer),
    );
  });
}
