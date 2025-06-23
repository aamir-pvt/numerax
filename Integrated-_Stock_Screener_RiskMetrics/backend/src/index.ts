const path = require("path");
require("dotenv").config();
import server from "./server";
import { mongodbConnection } from "./db";

async function main() {
  const port = process.env.PORT || 8000;
  await mongodbConnection(server.ioSocket)
    .then(() => {
      server.server.listen(port, () => {
        console.log(
          `Server is running on port: ${port} (HTTP) and 8443 (HTTPS)`
        );
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

main();
