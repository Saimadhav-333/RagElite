const express = require("express");
const router = express.Router();
const multer = require("multer");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { uploadPDF, queryModel } = require("../controllers/modelController");

const upload = multer({ dest: "uploads/" });

router.post("/upload", authenticateToken, authorizeRoles("admin"), upload.single("file"), uploadPDF);
router.post("/query", authenticateToken, authorizeRoles("user"), queryModel);

module.exports = router;
