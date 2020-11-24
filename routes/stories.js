const { render } = require("@testing-library/react");
const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Story = require("../models/Story");

// GET /stories
// Description: Public Stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("stories/index", {
      stories,
    });
  } catch (err) {
    console.error("error : ", err);
    res.render("error/500");
  }
});

// GET /stories/add
// Description: Show ADD page
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

// POST /stories
// Description: Add Story via POST form in story add hbs
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    console.log(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.error("error :", err);
    res.render("error/500");
  }
});

// GET /stories/:id
// Description: Show a single story (READ MORE)
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate("user").lean();
    if (!story) return res.render("error/404");
    res.render("stories/show", {
      story,
    });
  } catch (error) {
    console.error("error : ", error);
    res.render("error/404");
  }
});

// GET /stories/user/:userId
// Description: Any User Profile Page
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const user_stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();
    console.log(user_stories);
    res.render("stories/index", {
      stories: user_stories,
    });
  } catch (error) {
    console.error("error : ", error);
    res.render("error/500");
  }
});

// GET /stories/edit/:id
// Description: Show EDIT page
router.get("/edit/:id", ensureAuth, async (req, res) => {
  const storyToEdit = await Story.findOne({
    _id: req.params.id,
  }).lean();

  if (!storyToEdit) {
    return res.render("error/404");
  }

  if (storyToEdit.user != req.user.id) {
    // req.user or req.user.id??
    res.redirect("/stories");
  } else {
    res.render("stories/edit", {
      story: storyToEdit,
    });
  }
});

// PUT /stories/:id
// Description: Update story via id
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let storyToEdit = await Story.findById(req.params.id).lean();

    if (!storyToEdit) return res.render("error/404");

    if (storyToEdit.user != req.user.id) {
      res.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect("/stories");
    }
  } catch (err) {
    console.error("error : ", err);
    res.render("error/500");
  }
});

// DELETE /stories/:id
// Description: Delete story via id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Story.findOneAndDelete({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (err) {
    console.error("error : ", err);
    res.render("error/500");
  }
});

module.exports = router;
