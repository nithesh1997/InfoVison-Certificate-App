import { rest } from "msw";
import { payload } from "./payload";



export function trustlevelGroups(){
    const URL = `/${
      import.meta.env.VITE_BASE_API_PATH
    }/invisipoint/trustgroups?invisigateIp=192.168.120.108`;

    return rest.get(URL, (req, res, ctx) => {
      const id = req.url.search.replace("?", "");

      return res(ctx.delay(1000), ctx.status(200), ctx.json(payload.success));
    });
}
