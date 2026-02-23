const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Factory function — creates a multer instance for a specific section folder
const createUpload = (section) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = path.join("uploads", section);
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  return multer({ storage });
};

// Default export (fallback — uploads to flat uploads/ folder)
const upload = createUpload("");

module.exports = upload;
module.exports.createUpload = createUpload;
