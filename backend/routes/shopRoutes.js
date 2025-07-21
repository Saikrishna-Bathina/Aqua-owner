const express = require("express");
const router = express.Router();
const Shop = require("../models/owner"); // make sure the model path is correct

// ✅ GET /api/shops/:phone
router.get("/:phone", async (req, res) => {
  try {
    const phone = req.params.phone;
    const shop = await Shop.findOne({ phone });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json(shop);
  } catch (error) {
    console.error("Fetch shop error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
