import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { analyzeWebsite, captureScreenshot, getFavicon } from "./routes/website";
import { createSubaccountAndUser } from "./routes/ghl";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Website analysis routes
  app.post("/api/website/full-analysis", analyzeWebsite);
  app.post("/api/website/screenshot", captureScreenshot);
  app.post("/api/website/favicon", getFavicon);

  // GHL integration routes
  app.post("/api/ghl/create-subaccount-and-user", createSubaccountAndUser);

  return app;
}
