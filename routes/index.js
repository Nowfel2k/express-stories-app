const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

const Story = require("../models/Story");

// GET /
// Description: Login Page
router.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login_layout",
  });
});

// GET /dashboard
// Description: Dashboard Page
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const user_stories = await Story.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      stories: user_stories,
    });
  } catch (err) {
    console.error("error : ", err);
    res.render("error/500");
    // res.render("../views/error/500");
  }
});

module.exports = router;
