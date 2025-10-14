import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
// import { notifyLogin } from "./twilioController.js";
import { sendOtp} from "./otpController.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { transporter } from "../config/nodemailer.js";
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

    //check if user exists

    const existQuery = "select * from users where email = ?";
    const [existing] = await pool.query(existQuery, [email]);
    if (existing.length > 0) {
      return res.status(200).json({
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

    // 🔹 Check user
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    // 🔹 Check if verified
    if (!user.is_verified) {
      return res.status(200).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // 🔹 Compare password
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(200).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // 🔹 Generate tokens
    const payload = {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const access_secret_key = process.env.access_secret_key;
    const refresh_secret_key = process.env.refresh_secret_key;

    const accessToken = jwt.sign(payload, access_secret_key, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, refresh_secret_key, { expiresIn: "7d" });

    // 🔹 Set cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 15,
      sameSite: "strict",
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "strict",
      httpOnly: true,
    });

    // 🔹 Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
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

export const forgotPassword = async(req ,res)=>{
  try{
    const {email} = req.body;
    const [users] = await pool.query("select * from users where email=?",[email])

    if(users.length===0){
      return res.status(404).json({
        success:false,
        message: "User not found"
      });
    }

    const user = users[0];
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now()+15*60*1000);

    await pool.query(
      "update users set reset_token=? , reset_token_expires=? where user_id=?",
       [resetToken, resetTokenExpires, user.user_id]  
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Hi ${user.name},</p>
             <p>Click below to reset your password (valid 15 min):</p>
             <a href="${resetUrl}">${resetUrl}</a>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success:true,
      message:"reset link sent to your email"
    })

  }
  catch(err){

    console.log("Forgot password error:", err);
    res.status(500).json({ success: false, message: err.message });

  }

}


export const resetPassword = async (req, res) => {
  try{
    const {token , password} = req.body;

    const [users] = await pool.query(
   "SELECT * FROM users WHERE reset_token=? AND reset_token_expires > NOW()",
      [token]
    );

    if(users.length===0){
      return res.status(400).json({
        success:false,
        message:"Invalid or expired token"
      })

    }
    const user = users[0];
    const hashedPassword = await bcrypt.hash(password,10);

    await pool.query(
            "UPDATE users SET password=?, reset_token=NULL, reset_token_expires=NULL WHERE user_id=?",
      [hashedPassword, user.user_id]
    );
    res.status(200).json({ success: true, message: "Password reset successful" });

  }
  catch(err){
    console.log("Reset password error:", err);
    res.status(500).json({ success: false, message: err.message });

  }
}
  
   