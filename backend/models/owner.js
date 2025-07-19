const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  shopName: String,
  ownerName: String,
  phone: {
  type: String,
  required: true,
  unique: true,
  match: [/^\d{10}$/, "Phone number must be 10 digits long and numeric"]
},
  address: String,
  location: String,
  shopImage: String,
  stock: {
    waterTins: Boolean,
    coolingWaterTins: Boolean,
    waterBottles: Boolean,
    waterPackets: Boolean,
  },
  password: String
}, { timestamps: true });

module.exports = mongoose.model("Owner", ownerSchema);
