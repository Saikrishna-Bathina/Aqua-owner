const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { registerOwner } = require("../controllers/ownerController");

router.post("/register", upload.single("shopImage"), registerOwner);

module.exports = router;
