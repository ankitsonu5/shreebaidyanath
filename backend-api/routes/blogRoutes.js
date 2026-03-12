const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { createUpload } = require("../middlewares/upload");
const upload = createUpload("blogs");
const {
  createBlog,
  getAllBlogs,
  getAllBlogsAdmin,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

router.post("/add-blog", auth, upload.single("image"), createBlog);
router.get("/blogs", getAllBlogs);
router.get("/blogs/admin", auth, getAllBlogsAdmin);
router.get("/blog/:slug", getBlogBySlug);
router.put("/blog/:id", auth, upload.single("image"), updateBlog);
router.delete("/blog/:id", auth, deleteBlog);

module.exports = router;
