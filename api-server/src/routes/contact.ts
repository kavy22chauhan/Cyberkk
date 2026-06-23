import { Router } from "express";
import { db } from "@workspace/db";
import { contactsTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";

const router = Router();

// POST /contact
router.post("/contact", async (req, res) => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "All fields are required and email must be valid" });
  }

  await db.insert(contactsTable).values(parsed.data);

  return res.status(201).json({
    success: true,
    message: "Thank you for reaching out! We will get back to you shortly.",
  });
});

export default router;
