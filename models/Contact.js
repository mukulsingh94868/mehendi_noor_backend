import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    eventType: { type: String, required: true, trim: true, maxlength: 80 },
    eventDate: { type: String, trim: true, maxlength: 40, default: "" },
    location: { type: String, trim: true, maxlength: 200, default: "" },
    message: { type: String, trim: true, maxlength: 2000, default: "" },
    status: {
      type: String,
      enum: ["new", "read", "contacted", "archived"],
      default: "new",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default mongoose.models.Contact ||
  mongoose.model("Contact", contactSchema);
