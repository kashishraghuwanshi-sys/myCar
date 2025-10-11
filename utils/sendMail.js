import { response } from "express";
import { transporter } from "../config/nodemailer.js";
import dotenv from "dotenv";
dotenv.config();


const isValidEmail = (email)=>{
    const emailRegex=  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


export const sendEmail = async(to , subject , text)=>{
    try{
            if (!to || !isValidEmail(to)) {
      console.log("❌ Invalid email address:", to);
      return {
        success: false,
        message: "Please provide a valid email address.",
      };
    }
        const info = await transporter.sendMail({
            from : process.env.EMAIL_USER,
            to,
            subject,
            text,
        });

            if (!info || !info.accepted || info.accepted.length === 0) {
      console.log("❌ Email not sent. Check your SMTP or recipient email.");
      return {
        success: false,
        message: "Email not sent. Please check your email address.",
      };
    }
        console.log("Email Sent",info.response);
        return{
            success: true,
            message: "Email sent successfully.",
            response: info.response,
        }
    }
    catch(err){
        console.log("Email error :",err)
        return {
            success: false,
            message: "Failed to send email. Please try again later.",
            error: err.message,   
            
        };
    }

}