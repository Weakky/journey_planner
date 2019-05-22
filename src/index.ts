import * as express from "express";

const PORT = 8080; // default port to listen

main();

async function main() {
  const app = express();

  app.get("/", (_req, res) => {
    res.status(200).json({ status: "running" });
  });

  app.get("/travel", async (req, res) => {
    const { from, to }: { from: string; to: string } = req.query;

    res.status(200).json({ });
  });

  app.get("/seed", async (req, res) => {
    res.status(200).json({ seed: "running" });
  });

  // start the express server
  app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`🚀  Server started at http://localhost:${PORT}`);
  });
}