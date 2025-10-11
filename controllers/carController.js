import { pool } from "../config/db.js";

export const getAllCars = async(req,res)=>{
    try{
        const[cars]= await pool.query("select * from cars");
        res.status(200).json({
            success:true,
            message: "All Cars get Successfully",
            data:{
                cars
            }
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message :"Failed to fetch cars"+err.message
        });
    }
}
