import { serve } from "@hono/node-server";
import { app } from "../src/server";

serve(app, (info) => {
  console.log(`standalone server started at http://localhost:${info.port}`);
});
