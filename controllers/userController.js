import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [data] = await pool.query(
      "select user_id,name,email,phone,role,is_verified from users where user_id=?",
      [userId]
    );

    if (data.length === 0) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    const user = data[0];
    res.status(200).json({
      message: "user profile fetched successfully",
      profile: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error fetching profile",
    });
  }
};

//update profile

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, password } = req.body;

    if (!name && !phone && !password) {
      return res.status(400).json({
        message: "Please provide data to update",
      });
    }

    //existing user
    const [data] = await pool.query("select * from users where user_id=?", [
      userId,
    ]);

    if (data.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = data[0];

    // naye values ya purane values
    const updatedName = name || user.name;
    const updatedPhone = phone || user.phone;

    let updatedPassword = user.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(password, salt);
    }

    //update query
    await pool.query(
      "update users set name=?,phone=?,password=? where user_id=?",
      [updatedName, updatedPhone, updatedPassword, userId]
    );

    res.status(200).json({
      message: "Profile updated successfully",
      profile: {
        user_id: userId,
        name: updatedName,
        email: user.email, // email generally change nahi karte
        phone: updatedPhone,
        role: user.role,
        is_verified: user.is_verified,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "error updating profile",
    });
  }
};

