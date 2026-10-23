import { Router } from "express";
import {
  createContact,
  listContacts,
  deleteContact,
} from "../controllers/contactController.js";

const router = Router();

router.post("/", createContact);
router.get("/getList", listContacts);
router.delete("/:id", deleteContact);

export default router;
