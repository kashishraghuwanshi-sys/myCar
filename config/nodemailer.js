import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


export const transporter = nodemailer.createTransport({
    service : "gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


export const checkSMTPConnection = ()=>{
    transporter.verify((verify , success)=>{
        if(!error)
            {
                console.log("SMTP Connection established.....");
            }
        else{
            console.log("SMTP Connection failed...")
        }
    });

}