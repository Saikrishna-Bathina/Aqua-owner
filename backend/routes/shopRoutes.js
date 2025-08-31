const express = require("express");
const router = express.Router();
const Shop = require("../models/owner"); // ✅ Ensure correct model path

// GET /api/shops/:phone
router.get("/:phone", async (req, res) => {
  try {
    const phone = req.params.phone;
    console.log("phone num is :", phone);
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

// ✅ PUT /api/shops/:phone
router.put("/:phone", async (req, res) => {
  try {
    const phone = req.params.phone;

    // ❌ Prevent phone number update
    if (req.body.phone && req.body.phone !== phone) {
      return res.status(400).json({ message: "Phone number cannot be updated" });
    }

    const updates = { ...req.body };
    delete updates.phone; // extra safety - remove phone if present in body

    const updatedShop = await Shop.findOneAndUpdate(
      { phone },
      updates,
      { new: true } // return updated document
    );

    if (!updatedShop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json(updatedShop);
  } catch (error) {
    console.error("Update shop error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
