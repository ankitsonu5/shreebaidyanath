const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  createComment,
  getBlogComments,
  getCommentsAdmin,
  deleteCommentAdmin,
} = require("../controllers/commentController");

// Public routes for submitting and viewing blog comments
router.post("/blog/:slug/comment", createComment);
router.get("/blog/:slug/comments", getBlogComments);

// Admin-moderation protected routes
router.get("/admin/comments", auth, getCommentsAdmin);
router.delete("/admin/comment/:id", auth, deleteCommentAdmin);

module.exports = router;
