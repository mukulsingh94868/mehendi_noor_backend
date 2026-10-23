import mongoose from "mongoose";

export const GALLERY_CATEGORIES = [
  "Bridal",
  "Arabic",
  "Rajasthani",
  "Minimal",
  "Festival",
];

const galleryItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    category: { type: String, required: true, enum: GALLERY_CATEGORIES },
    src: { type: String, required: true, trim: true, maxlength: 2048 },
    width: { type: Number, required: true, min: 1, max: 10000 },
    height: { type: Number, required: true, min: 1, max: 10000 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default mongoose.models.GalleryItem ||
  mongoose.model("GalleryItem", galleryItemSchema);
