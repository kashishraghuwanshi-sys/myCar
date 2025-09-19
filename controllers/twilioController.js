
import client from "../config/twilio.js";
import {pool} from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const sendSMS = async(to , body)=>{
    try{
     await client.messages.create({
      from: process.env.TWILIO_PHONE,
      to,
      body  
    });
    console.log(`✅ SMS sent to ${to}`);
}
catch(err){
    console.error(`❌ Failed to send SMS to ${to}:`, err.message);
}
};

//notify both users and admin

export const notifyLogin = async (user) =>{
    const userMsg = `Welcome${user.name},you logged in at ${new Date().toLocaleString()}`;
    await sendSMS(user.phone, userMsg);


      // admin ko msg
  const [admins] = await pool.query("SELECT name, phone FROM users WHERE role='admin'");
  const adminMsg = `User ${user.name} (${user.email}) logged in at ${new Date().toLocaleString()}`;

  for (const admin of admins) {
    await sendSMS(admin.phone, adminMsg);
  }
}