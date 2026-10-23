import dotenv from "dotenv";
import mongoose from "mongoose";
import GalleryItem from "../models/GalleryItem.js";
import Service from "../models/Service.js";

dotenv.config();

const websiteUrl = "https://mehendi-noor.vercel.app";
const galleryItems = [
  ["g01", "Full bridal hand & feet", "Bridal", "gallery-01.svg", 900, 1200],
  ["g02", "Portrait bridal motifs", "Bridal", "gallery-02.svg", 900, 900],
  ["g03", "Arabic vine cuff", "Arabic", "gallery-03.svg", 900, 1150],
  ["g04", "Floating floral trail", "Arabic", "gallery-04.svg", 900, 900],
  ["g05", "Royal jaali detail", "Rajasthani", "gallery-05.svg", 900, 1100],
  ["g06", "Heritage arch panel", "Rajasthani", "gallery-06.svg", 900, 900],
  ["g07", "Fine minimal wrist", "Minimal", "gallery-07.svg", 900, 1200],
  ["g08", "Single motif study", "Minimal", "gallery-08.svg", 900, 900],
  ["g09", "Festive toran border", "Festival", "gallery-09.svg", 900, 1150],
  ["g10", "Diya & bloom cluster", "Festival", "gallery-10.svg", 900, 900],
  ["g11", "Bridal forearm cascade", "Bridal", "gallery-11.svg", 900, 1050],
  ["g12", "Engagement centrepiece", "Bridal", "gallery-12.svg", 900, 950],
  ["g13", "Open arabic composition", "Arabic", "gallery-13.svg", 900, 1100],
  ["g14", "Quiet botanical line", "Minimal", "gallery-14.svg", 900, 900],
].map(([id, title, category, file, width, height], order) => ({
  id,
  title,
  category,
  src: `${websiteUrl}/images/${file}`,
  width,
  height,
  order,
}));

const services = [
  ["bridal", "Bridal Mehndi", "Intricate full-hand and full-feet artistry, composed around your outfit, jewellery and love story.", "service-bridal.svg", "Crown"],
  ["arabic", "Arabic Mehndi", "Flowing vines, bold florals and open spacing for a modern, breathable look.", "service-arabic.svg", "Flower2"],
  ["rajasthani", "Rajasthani Mehndi", "Heritage motifs, jaali work and fine detailing inspired by royal Rajasthani craft.", "service-rajasthani.svg", "Gem"],
  ["engagement", "Engagement Mehndi", "Refined, camera-ready designs for the ring ceremony, sangeet and pre-wedding shoots.", "service-engagement.svg", "HeartHandshake"],
  ["festival", "Festival Mehndi", "Celebratory patterns for Karwa Chauth, Teej, Diwali, Eid and family gatherings.", "service-festival.svg", "Sparkles"],
  ["guest", "Guest Mehndi", "Coordinated team artistry so every guest leaves with a beautiful, personalised design.", "service-guest.svg", "Users"],
  ["groom", "Groom Mehndi", "Subtle, masculine detailing for the groom — initials, motifs and meaningful symbols.", "service-groom.svg", "User"],
  ["custom", "Custom Designs", "A design sketched from scratch around your story, theme, venue or heirloom jewellery.", "service-custom.svg", "PenTool"],
].map(([id, title, description, file, icon], order) => ({
  id,
  title,
  description,
  image: `${websiteUrl}/images/${file}`,
  icon,
  order,
}));

async function seedCollection(model, items) {
  await Promise.all(
    items.map((item) =>
      model.updateOne({ id: item.id }, { $setOnInsert: item }, { upsert: true })
    )
  );
}

try {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be configured.");
  await mongoose.connect(process.env.MONGO_URI);
  await seedCollection(GalleryItem, galleryItems);
  await seedCollection(Service, services);
  console.log(`Seeded ${galleryItems.length} gallery items and ${services.length} services.`);
} catch (error) {
  console.error("Content seed failed:", error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
