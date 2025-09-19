import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const sId = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;

const client = twilio(
    sId,
    authToken
)
export default client;