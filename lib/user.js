// lib/user.js

/**
 * Temporary user system
 * Later replaced by authentication (Clerk/Auth.js/etc.)
 */

export function getCurrentUser() {
  return {
    userId: "default-user",   // future: auth.user.id
    userType: "individual",   // "individual" | "school"
    plan: "free",             // "free" | "subscriber" | "school"
  };
}
