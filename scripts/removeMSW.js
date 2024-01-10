import { unlink } from "fs";

(function () {
  unlink(`build/mockServiceWorker.js`, (error) => {
    if (error) {
      console.error("%c ⚠️ Oops..! ⚠️", "color: #DC143C;");
      console.error(error);
      return;
    }

    console.log("%cFile removed successfully", "color: #DC143C;");
  });
})();
