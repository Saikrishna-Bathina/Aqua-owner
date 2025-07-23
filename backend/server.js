
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const ownerRoutes = require("./routes/ownerRoutes");
const shopRoutes = require("./routes/shopRoutes");
const orderRoutes = require("./routes/ordersRoutes"); // ✅ add this



dotenv.config(); 

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
})); // Enable CORS for frontend-backend communication
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse form data (multipart/form-data)

// Routes
app.use("/api/owner", ownerRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/orders", orderRoutes); // ✅ mount it properly


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
