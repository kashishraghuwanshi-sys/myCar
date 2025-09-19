import mysql2 from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const pool = mysql2.createPool({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectionLimit: 10,
    waitForConnections : true
})

export async function checkConnection () {
    const connect = await pool.getConnection();
    console.log("Database Connected Successfully");
    connect.release();

}