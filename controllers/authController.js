import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
// import { notifyLogin } from "./twilioController.js";
import { sendOtp , verifyOtp} from "./otpController.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  try {
    let { name, email, password, phone, role } = req.body;

    //check if user existe

    const existQuery = "select * from users where email = ?";
    const [existing] = await pool.query(existQuery, [email]);
    if (existing.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    //hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query =
      "insert into users (name, email, password, phone, role) values(?,?,?,?,?)";
    const [data] = await pool.query(query, [
      name,
      email,
      hashedPassword,
      phone,
      role || "customer",
    ]);

    const userId = data.insertId;

    const otpSent = await sendOtp(userId, email);

    if (!otpSent) {
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    res.status(201).json({
      message: "user registered successfully pls verify otp",
    });
  } catch (err) {
    console.log(err);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check user
    const [users] = await pool.query("select * from users where email=?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(400).json({
        message: "user not found",
      });
    }
    const user = users[0];

    //check if verified
    if (!user.is_verified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }

    //compare password
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    //genrate token
    const payload = {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role:user.role,
    };

    const access_secret_key = process.env.access_secret_key;
    const refresh_secret_key = process.env.refresh_secret_key;

    const generateAccessToken = jwt.sign(payload, access_secret_key, {
      expiresIn: "15m",
    });
    const generateRefreshToken = jwt.sign(payload, refresh_secret_key, {
      expiresIn: "7d",
    });

    res.cookie("accessToken", generateAccessToken, {
      maxAge: 1000 * 60 * 15,
      sameSite: "strict",
      httpOnly: true,
    });

    res.cookie("refreshToken", generateRefreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "strict",
      httpOnly: true,
    });

    // await notifyLogin(user);

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.log(err);
  }
};

// export const profile = (req, res) => {
//   const data = req.user;
//   console.log(data.email);

//   res.status(200).json({
//     message: "welcome user we are on profile",
//     data: data.email,
//   });
// };

export const logout = (req, res) => {
  res.clearCookie("accessToken");
  // res.clearCookie("refreshToken")
  res.status(200).json({ message: "Logout successful" });
};
