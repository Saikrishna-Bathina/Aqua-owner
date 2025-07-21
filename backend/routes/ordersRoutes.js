const express = require("express");
const router = express.Router();
const Order = require("../models/order"); // adjust path
const verifyToken = require("../middleware/auth"); // your JWT middleware

// GET orders for logged-in shop owner
router.get("/my-shop-orders", verifyToken, async (req, res) => {
  console.log("✅ Received request to /my-shop-orders");
  console.log("Decoded JWT user:", req.user);

  try {
    const shopPhone = req.user.phone;

    const orders = await Order.find({ shopPhone }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("❌ Fetch orders failed", error);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
