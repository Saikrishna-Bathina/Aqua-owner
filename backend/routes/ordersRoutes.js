const express = require("express");
const router = express.Router();
const Order = require("../models/order"); // adjust path
const verifyToken = require("../middleware/auth"); // your JWT middleware
const mongoose = require("mongoose"); // ✅ Add this line


// GET orders for logged-in shop owner
router.get("/my-shop-orders", verifyToken, async (req, res) => {
  

  try {
    const shopPhone = req.user.phone;
    console.log("phonenum",shopPhone);

    const orders = await Order.find({ shopPhone }).sort({ createdAt: -1 });
    console.log(orders);

    res.json(orders);
  } catch (error) {
    console.error("❌ Fetch orders failed", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// PUT /api/orders/update-status/:orderId
router.put("/update-status/:orderId", verifyToken, async (req, res) => {
  console.log("entered pu method");
  try {
    console.log("Request to update status:", req.params.orderId);
    const { deliveryStatus } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
  return res.status(400).json({ message: "Invalid Order ID format" });
}

    order.deliveryStatus = deliveryStatus;
    await order.save();

    res.status(200).json({ message: "Delivery status updated", order });
  } catch (err) {
    console.error("Error in update-status route:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
