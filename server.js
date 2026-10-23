import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const allowedOrigins = (
  process.env.FRONTEND_ORIGINS ||
  "http://localhost:3000,https://mehendi-noor.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin is not allowed by CORS"));
    },
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));
app.use(
  "/api/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    dotfiles: "deny",
    index: false,
  }),
);

app.get("/api/health", (_request, response) => {
  response.json({ success: true, data: { status: "ok" } });
});

app.use("/api", contentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

app.use((_request, response) => {
  response.status(404).json({ success: false, message: "API endpoint not found." });
});

app.use((error, _request, response, _next) => {
  if (error.type === "entity.too.large") {
    response.status(413).json({
      success: false,
      message: "Request body exceeds the 1 MB limit.",
    });
    return;
  }
  if (error.message === "Origin is not allowed by CORS") {
    response.status(403).json({ success: false, message: error.message });
    return;
  }
  if (
    error.name === "MulterError" ||
    error.message === "Unsupported image type."
  ) {
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    response.status(status).json({ success: false, message: error.message });
    return;
  }
  if (error.name === "ValidationError" || error.name === "CastError") {
    response.status(400).json({ success: false, message: error.message });
    return;
  }
  if (error.code === 11000) {
    response.status(409).json({
      success: false,
      message: "A record with that unique value already exists.",
    });
    return;
  }
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    response
      .status(400)
      .json({ success: false, message: "Invalid JSON request body." });
    return;
  }

  console.error("Request error:", error);
  response
    .status(500)
    .json({ success: false, message: "Internal server error." });
});

if (!MONGO_URI) {
  throw new Error("MONGO_URI must be configured.");
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB connection established");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exitCode = 1;
  });
