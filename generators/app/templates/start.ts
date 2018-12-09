require('source-map-support').install();

import MainServer from "./api/server";

new MainServer().listen().catch(error => {
  console.error(error);
  process.exit(-1);
});
