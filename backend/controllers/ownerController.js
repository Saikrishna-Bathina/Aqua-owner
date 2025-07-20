const Owner = require("../models/owner");
const bcrypt = require("bcryptjs");

// Password validation function
const isValidPassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation function
const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10}$/; // Only 10 digits
  return phoneRegex.test(phone);
};

exports.registerOwner = async (req, res) => {
  const {
    shopName,
    ownerName,
    phone,
    address,
    location,
    password,
    stock,
  } = req.body;

  try {
    // Phone number validation
    if (!isValidPhone(phone)) {
      return res.status(400).json({
        message: "Phone number must be exactly 10 digits and contain only numbers.",
      });
    }

    // Password validation
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.",
      });
    }

    const existing = await Owner.findOne({ phone });
    if (existing)
      return res
        .status(400)
        .json({ message: "Phone already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newOwner = new Owner({
      shopName,
      ownerName,
      phone,
      address,
      location,
      shopImage: req.file?.path || "", // Cloudinary image URL
      stock: typeof stock === "string" ? JSON.parse(stock) : stock,
      password: hashedPassword,
    });

    console.log("Parsed stock:", newOwner.stock);

    await newOwner.save();
    res.status(201).json({ message: "Owner registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.loginOwner = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const owner = await Owner.findOne({ phone });
    if (!owner) {
      return res.status(400).json({ message: "Phone not registered" });
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", owner }); // you can send token here too
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};