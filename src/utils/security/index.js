import DOMPurify from "dompurify";

export const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const SecurityUtils = {
  setSession() {
    localStorage.setItem("lastActivity", Date.now().toString());
    localStorage.setItem(
      "sessionExpiry",
      (Date.now() + SESSION_DURATION).toString()
    );
  },

  updateActivity() {
    localStorage.setItem("lastActivity", Date.now().toString());
  },

  clearSession() {
    localStorage.removeItem("lastActivity");
    localStorage.removeItem("sessionExpiry");
  },

  isSessionValid() {
    const lastActivity = localStorage.getItem("lastActivity");
    const sessionExpiry = localStorage.getItem("sessionExpiry");

    if (!lastActivity || !sessionExpiry) return false;

    const isExpired = Date.now() > parseInt(sessionExpiry);
    const isInactive = Date.now() - parseInt(lastActivity) > INACTIVITY_TIMEOUT;

    return !isExpired && !isInactive;
  },

  sanitizeInput(input) {
    if (typeof input !== "string") return input;
    return DOMPurify.sanitize(input.trim());
  },

  sanitizeObject(obj) {
    if (!obj || typeof obj !== "object") return obj;

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === "password") {
        sanitized[key] = value;
      } else if (typeof value === "string") {
        sanitized[key] = this.sanitizeInput(value);
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  },
};
