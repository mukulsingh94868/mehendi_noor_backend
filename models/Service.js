import mongoose from "mongoose";

export const SERVICE_ICONS = [
  "Crown",
  "Flower2",
  "Gem",
  "HeartHandshake",
  "Sparkles",
  "Users",
  "User",
  "PenTool",
];

const serviceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    image: { type: String, required: true, trim: true, maxlength: 2048 },
    icon: { type: String, required: true, enum: SERVICE_ICONS },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default mongoose.models.Service || mongoose.model("Service", serviceSchema);
