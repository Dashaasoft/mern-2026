import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Fake OTP: 1234 ашиглана
export const loginUser = async (req, res) => {
  try {
    const { phone, name, otp } = req.body;

    if (otp !== "1234") return res.status(400).json({ message: "OTP буруу" });

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, name });
    }

    const token = jwt.sign(
      { id: user._id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
