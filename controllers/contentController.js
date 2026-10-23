import mongoose from "mongoose";
import GalleryItem from "../models/GalleryItem.js";
import Service from "../models/Service.js";
import Testimonial from "../models/Testimonial.js";

export const contentModels = {
  gallery: {
    model: GalleryItem,
    fields: ["id", "title", "category", "src", "width", "height", "order"],
    publicFilter: {},
    sort: { order: 1, createdAt: 1 },
  },
  services: {
    model: Service,
    fields: ["id", "title", "description", "image", "icon", "order"],
    publicFilter: {},
    sort: { order: 1, createdAt: 1 },
  },
  testimonials: {
    model: Testimonial,
    fields: ["name", "event", "quote", "rating", "isPublished", "order"],
    publicFilter: { isPublished: true },
    sort: { order: 1, createdAt: 1 },
  },
};

function pickFields(body, fields) {
  return Object.fromEntries(
    fields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]])
  );
}

function resolveConfig(resource) {
  return contentModels[resource];
}

export async function listPublicContent(request, response, next) {
  try {
    const { resource } = request.params;
    const config = resolveConfig(resource);
    if (!config) {
      response.status(404).json({ success: false, message: "Content resource not found." });
      return;
    }
    const query = { ...config.publicFilter };
    if (resource === "gallery" && request.query.category) {
      query.category = request.query.category;
    }
    const data = await config.model.find(query).sort(config.sort);
    response.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function listAdminContent(request, response, next) {
  try {
    const config = resolveConfig(request.params.resource);
    if (!config) {
      response.status(404).json({ success: false, message: "Content resource not found." });
      return;
    }
    const data = await config.model.find().sort(config.sort);
    response.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createContent(request, response, next) {
  try {
    const config = resolveConfig(request.params.resource);
    if (!config) {
      response.status(404).json({ success: false, message: "Content resource not found." });
      return;
    }
    const document = await config.model.create(
      pickFields(request.body ?? {}, config.fields)
    );
    response.status(201).json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
}

export async function updateContent(request, response, next) {
  try {
    const config = resolveConfig(request.params.resource);
    if (!config) {
      response.status(404).json({ success: false, message: "Content resource not found." });
      return;
    }
    if (!mongoose.isValidObjectId(request.params.id)) {
      response.status(400).json({ success: false, message: "Invalid content ID." });
      return;
    }
    const document = await config.model.findByIdAndUpdate(
      request.params.id,
      pickFields(request.body ?? {}, config.fields),
      { new: true, runValidators: true }
    );
    if (!document) {
      response.status(404).json({ success: false, message: "Content not found." });
      return;
    }
    response.json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
}

export async function deleteContent(request, response, next) {
  try {
    const config = resolveConfig(request.params.resource);
    if (!config) {
      response.status(404).json({ success: false, message: "Content resource not found." });
      return;
    }
    if (!mongoose.isValidObjectId(request.params.id)) {
      response.status(400).json({ success: false, message: "Invalid content ID." });
      return;
    }
    const document = await config.model.findByIdAndDelete(request.params.id);
    if (!document) {
      response.status(404).json({ success: false, message: "Content not found." });
      return;
    }
    response.json({ success: true, data: { id: document.id } });
  } catch (error) {
    next(error);
  }
}
