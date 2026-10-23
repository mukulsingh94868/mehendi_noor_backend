import { randomUUID } from "crypto";
import { Router } from "express";
import multer from "multer";
import path from "path";
import { loginAdmin } from "../controllers/adminController.js";
import {
  createContent,
  deleteContent,
  listAdminContent,
  updateContent,
} from "../controllers/contentController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { SERVICE_ICONS } from "../models/Service.js";

const router = Router();
const uploadDirectory = path.join(process.cwd(), "uploads");
const allowedImageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
]);

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (_request, file, callback) => {
      callback(null, `${randomUUID()}${allowedImageTypes.get(file.mimetype)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      callback(new Error("Unsupported image type."));
      return;
    }
    callback(null, true);
  },
});

router.post("/login", loginAdmin);
router.use(requireAdmin);

router.post("/uploads", upload.single("image"), (request, response) => {
  if (!request.file) {
    response.status(400).json({ success: false, message: "An image file is required." });
    return;
  }
  const baseUrl = (process.env.PUBLIC_API_URL || `${request.protocol}://${request.get("host")}`)
    .replace(/\/$/, "");
  response.status(201).json({
    success: true,
    data: { url: `${baseUrl}/api/uploads/${request.file.filename}` },
  });
});
router.get("/service-icons", (_request, response) => {
  response.json({ success: true, data: SERVICE_ICONS });
});
// router.get("/contacts", listContacts);
// router.put("/contacts/:id", updateContact);
// router.patch("/contacts/:id", updateContact);
// router.delete("/contacts/:id", deleteContact);

router.get("/:resource", listAdminContent);
router.post("/:resource", createContent);
router.put("/:resource/:id", updateContent);
router.patch("/:resource/:id", updateContent);
router.delete("/:resource/:id", deleteContent);

export default router;
