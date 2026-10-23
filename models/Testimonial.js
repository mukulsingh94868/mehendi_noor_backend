import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    event: { type: String, required: true, trim: true, maxlength: 120 },
    quote: { type: String, required: true, trim: true, maxlength: 2000 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    isPublished: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default mongoose.models.Testimonial ||
  mongoose.model("Testimonial", testimonialSchema);
