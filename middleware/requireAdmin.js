import jwt from "jsonwebtoken";

export function requireAdmin(request, response, next) {
  const authorization = request.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!token) {
    response.status(401).json({ success: false, message: "Admin token required." });
    return;
  }

  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    response.status(503).json({
      success: false,
      message: "Admin authentication is not configured.",
    });
    return;
  }

  try {
    const payload = jwt.verify(token, secret);
    if (typeof payload !== "object" || payload.role !== "admin") {
      response.status(401).json({ success: false, message: "Invalid admin token." });
      return;
    }
    request.admin = { email: payload.email };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      response.status(401).json({ success: false, message: "Invalid or expired admin token." });
      return;
    }
    next(error);
  }
}
