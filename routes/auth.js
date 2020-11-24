const express = require("express");
const passport = require("passport");
const router = express.Router();

// GET /auth/google
// Description: Auth With Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

// GET /auth/google/callback
// Description: Callback from Auth
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// GET /auth/logout
// Description: Logout Profile
router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
