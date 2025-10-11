import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
// import { notifyLogin } from "./twilioController.js";
import { sendOtp} from "./otpController.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Agar future me extra logic chahiye jaise JWT generate karna
export const googleProfile = (req, res) => {
    if (!req.user) 
      return res.status(401).json
    ({ 
    success:false,
    message: "Not logged in"
   });
  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    data: req.user 
  });
};


export const register = async (req, res) => {
  try {
    let { name, email, password, phone, role } = req.body;

    //check if user existe

    const existQuery = "select * from users where email = ?";
    const [existing] = await pool.query(existQuery, [email]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
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
      return res.status(500).json({
        success:false,
         message: "Failed to send OTP"
        });
    }

    res.status(201).json({
      success:true,
      message: "user registered successfully pls verify otp",
    });
  } catch (err) {
    console.log(err);
      res.status(500).json({
      success: false,
      message: "Registration failed",
      error: err.message,
    });
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
        success: false,
        message: "user not found",
      });
    }
    const user = users[0];

    //check if verified
    if (!user.is_verified) {
      return res
        .status(400)
        .json({ 
          success: false,
          message: "Please verify your email first" 
        });
    }

    //compare password
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ 
        success:false,
        message: "Incorrect password" ,
      });
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
    res.status(200).json({
      success:true,
       message: "Login successful",
       data:{
         user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
       } 
      });
  } catch (err) {
    console.log(err);
       res.status(500).json({
      success: false,
      message: "Login failed",
      error: err.message,
    });
  }
};

export const logout = (req, res) => {
try{
    res.clearCookie("accessToken");
  res.clearCookie("refreshToken")
  res.status(200).json({ 
    success: true,
    message: "Logout successful" });
}
catch(err){
      res.status(500).json({
      success: false,
      message: "Logout failed",
      error: err.message,
    });
  }
};
