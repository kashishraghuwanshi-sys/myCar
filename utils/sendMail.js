import { transporter } from "../config/nodemailer.js";
import dotenv from "dotenv";
dotenv.config();



export const sendEmail = async(to , subject , text)=>{
    try{
        const info = await transporter.sendMail({
            from : process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
        console.log("Email Sent",info.response);
        return true;
    }
    catch(err){
        console.log("Email error :",err)
        return false;
    }

}