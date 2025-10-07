import crypto from "crypto";
import { pool } from "../config/db.js";
import { sendEmail } from "../utils/sendMail.js";

export const sendOtp = async (userId,email) => {
  try {
    const otp = crypto.randomInt(100000, 999999);
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    const query =
      "insert into otps (user_id,otp_code , expires_at)values(?,?,?)";
    const [data] = await pool.query(query, [userId, otp, expires]);

    const sendMsg = await sendEmail(
      email,
      "your otp code",
      `your OTP is :${otp}.It will be expire in 5 minute`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const query = "select * from users where email =?";
    const [data] = await pool.query(query, [email]);
    if (data.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }
    const user = data[0]
    console.log(user);

    // get otp from db

    const [records] = await pool.query("SELECT * FROM otps WHERE user_id=? ORDER BY created_at DESC LIMIT 1",[user.user_id]);

    if(records.length === 0){
        return res.status(400).json({
            message: "otp not found"
        })
    }

        const record = records[0];
        console.log(record);

        //check expirey
    if(new Date(record.expires_at)<new Date()){
       return res.status(400).json({ message: "OTP expired" }); 
    }

    // check match
    if (record.otp_code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    
    // update user verified

    await pool.query("UPDATE users SET is_verified = TRUE WHERE user_id=?", [user.user_id]);

    await pool.query("DELETE FROM otps WHERE user_id=?", [user.user_id]);
   
    res.json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    
  }
};
