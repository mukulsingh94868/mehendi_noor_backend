import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function loginAdmin(request, response, next) {
  try {
    const email = process.env.ADMIN_EMAIL;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    const secret = process.env.ADMIN_JWT_SECRET;

    if (!email || !passwordHash || !secret || secret.length < 32) {
      response.status(503).json({
        success: false,
        message: "Admin authentication is not configured.",
      });
      return;
    }

    const { email: submittedEmail, password } = request.body ?? {};
    if (
      typeof submittedEmail !== "string" ||
      typeof password !== "string" ||
      submittedEmail.toLowerCase() !== email.toLowerCase() ||
      !(await bcrypt.compare(password, passwordHash))
    ) {
      response.status(401).json({ success: false, message: "Invalid email or password." });
      return;
    }

    const token = jwt.sign({ role: "admin", email }, secret, { expiresIn: "8h" });
    response.json({ success: true, data: { token, expiresIn: 28800 } });
  } catch (error) {
    next(error);
  }
}
