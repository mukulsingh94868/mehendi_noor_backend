import mongoose from "mongoose";
import Contact from "../models/Contact.js";

const contactFields = [
  "name",
  "phone",
  "eventType",
  "eventDate",
  "location",
  "message",
  "status",
];

function pickFields(body, fields) {
  return Object.fromEntries(
    fields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]])
  );
}

export async function createContact(request, response, next) {
  try {
    const contact = await Contact.create(
      pickFields(request.body ?? {}, contactFields.filter((field) => field !== "status"))
    );
    response.status(201).json({ statusCode: 201, success: true, data: contact, message: "Contact created." });
  } catch (error) {
    next(error);
  }
}

export async function listContacts(_request, response, next) {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    response.json({ success: true, data: contacts });
  } catch (error) {
    next(error);
  }
}

export async function deleteContact(request, response, next) {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) {
      response.status(400).json({ success: false, message: "Invalid contact ID." });
      return;
    }
    const contact = await Contact.findByIdAndDelete(request.params.id);
    if (!contact) {
      response.status(404).json({ success: false, message: "Contact not found." });
      return;
    }
    response.json({ statusCode: 200, success: true, message: "Contact deleted." });
  } catch (error) {
    next(error);
  }
}
