import { rest } from "msw";

export function invisinetEnterpriseManager() {
  const URL = `/${import.meta.env.VITE_BASE_API_PATH}/iem/certificate/download`;

  return rest.post(URL, async (req, res, ctx) => {
    const buffer = await fetch(
      "https://jsonplaceholder.typicode.com/photos/1",
    ).then((res) => res.arrayBuffer());

    return res(
      ctx.status(200),
      ctx.set("Content-Length", buffer.byteLength.toString()),
      ctx.set("Content-Type", "application/octet-stream"),
      ctx.set("Content-Disposition", 'attachment; filename="hello-friend.zip"'),
      ctx.body(buffer),
    );
  });
}
