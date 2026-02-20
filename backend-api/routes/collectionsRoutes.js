const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");

const {
  createCollection,
  getAllCollection,
  getCollectionById,
  updateCollection,
  deleteCollection,
} = require("../controllers/colletionsController");

router.post("/add-collection", auth, upload.single("image"), createCollection);
router.get("/collection", getAllCollection);
router.get("/collection/:id", getCollectionById);
router.put("/collection/:id", auth, upload.single("image"), updateCollection);
router.delete("/collection/:id", auth, deleteCollection);

module.exports = router;
