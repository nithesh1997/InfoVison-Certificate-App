import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import macrosPlugin from "vite-plugin-babel-macros";
import svgr from "vite-plugin-svgr";

import * as child from "child_process";

const commitHash = child
  .execSync("git rev-parse HEAD")
  .toString()
  .replace("\n", "");

const base = import.meta.env?.VITE_BASE_ROUTE_PATH
  ? `/${import.meta.env.VITE_BASE_ROUTE_PATH}/`
  : ``;

export default defineConfig({
  base,
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
  plugins: [react(), macrosPlugin(), svgr()],
  build: {
    target: "es2015",
    outDir: "build",
  },
  resolve: {
    alias: {
      server: "/server",
      src: "/src",
      api: "/src/api",
      assets: "/src/assets",
      components: "/src/Components",
      pages: "/src/Pages",
      routes: "/src/routes",
      services: "/src/services",
      style: "/src/style",
      utils: "/src/utils",
      "@App": "/src/App.jsx",
      "@App.Style": "/src/App.style.jsx",
      "@i18n": "/src/i18n.js",
      "@Main": "/src/main.jsx",
      "@Main.Style": "/src/index.css",
      "@Store": "/src/store.js",
    },
  },
});
