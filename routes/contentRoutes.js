import { Router } from "express";
import { listPublicContent } from "../controllers/contentController.js";
import { GALLERY_CATEGORIES } from "../models/GalleryItem.js";

const router = Router();

router.get("/gallery", (request, response, next) => {
  request.params.resource = "gallery";
  listPublicContent(request, response, next);
});
router.get("/gallery/categories", (_request, response) => {
  response.json({ success: true, data: GALLERY_CATEGORIES });
});
router.get("/services", (request, response, next) => {
  request.params.resource = "services";
  listPublicContent(request, response, next);
});
router.get("/testimonials", (request, response, next) => {
  request.params.resource = "testimonials";
  listPublicContent(request, response, next);
});

export default router;
