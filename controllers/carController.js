import { pool } from "../config/db.js";

export const getAllCars = async(req,res)=>{
    try{
        const[cars]= await pool.query("select * from cars");
        res.status(200).json({cars});
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message : "error fetching cars"
        });
    }
}
