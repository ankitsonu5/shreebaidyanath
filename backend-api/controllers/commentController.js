const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

// 1. Submit a reply/comment to a blog (Public)
exports.createComment = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, email, website, comment } = req.body;

    if (!name || !email || !comment) {
      return res.status(400).json({
        success: false,
        message:
          "Please fill in all required fields: name, email, and comment.",
      });
    }

    // Find the blog by slug or ID to make sure it exists and get its reference
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    const newComment = new Comment({
      blogId: blog._id,
      name,
      email,
      website: website || "",
      comment,
    });

    await newComment.save();

    res.status(201).json({
      success: true,
      message: "Comment posted successfully!",
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 2. Fetch comments for a specific blog post (Public)
exports.getBlogComments = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    const comments = await Comment.find({
      blogId: blog._id,
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 3. Fetch all comments in the system for administrative moderation (Admin Protected)
exports.getCommentsAdmin = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("blogId", "title slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 4. Delete a comment permanently (Admin Protected)
exports.deleteCommentAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
