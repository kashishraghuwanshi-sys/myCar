import {pool} from "../config/db.js"
import { upload } from "../config/cloudinaryConfig.js";
import { query } from "express-validator";

export const addCar = async(req , res)=>{
    try{
        const {brand,model,type,year,fuel_type,seating_capacity,price,rent_per_day,status} = req.body;

        let image_url = req.file ? req.file.path : null;

        const query = "insert into cars (brand, model,type,year,fuel_type,seating_capacity,price,rent_per_day,status,image_url)values(?, ?, ?, ?, ?, ?, ?, ?, ?,?)";

        const [result] = await pool.query(query,[
            brand,model,type,year,fuel_type,seating_capacity,price,rent_per_day,status || 'Available',image_url,

        ]);

        res.status(201).json({
            success: true,
            message: "car added successfully",
            data:{
            car_id : result.insertId,
            image_url:image_url,
            }
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message:"error adding car",
            error:err.message,
        })
    }
};

export const getAllCars = async(req,res)=>{
    try{
        const[cars]= await pool.query("select * from cars");
        res.status(200).json({
      success: true,
      message: "Cars fetched successfully",
      total: cars.length, // optional: total cars count
      data: cars,
        });

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message : "error fetching cars",
            error: err.message
        });
    }
}

export const getCarById = async(req,res)=>{
    try{
        const {id} = req.params;
        const [cars] = await pool.query("select * from cars where car_id=?",[id]);

        if(cars.length===0){
            return res.status(404).json({
                success:false,
                message: "car not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "car fetched successfully",
            data: cars[0],
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Error fetching car",
            error:err.message,
        });
    }
}

export const updateCar = async(req ,res)=>{
    try{
        const {id} = req.params;
        const {brand, model,type, year, fuel_type, seating_capacity, price, rent_per_day, status} = req.body;

        

        if (req.file){
            // agar image upload hui hain

            const imageUrl = req.file.path;
        

        const query = "UPDATE cars SET brand=?, model=?,type=?, year=?, fuel_type=?, seating_capacity=?, price=?, rent_per_day=?, status=?, image_url=? WHERE car_id=?";

        const [data] = await pool.query(query,[brand, model,type, year, fuel_type, seating_capacity, price, rent_per_day, status,imageUrl,id]);

        }
        else{
             // Sirf details update
             query =
        "UPDATE cars SET brand=?, model=?,type=?, year=?, fuel_type=?, seating_capacity=?, price=?, rent_per_day=?, status=? WHERE car_id=?";
      params = [
        brand,
        model,
        type,
        year,
        fuel_type,
        seating_capacity,
        price,
        rent_per_day,
        status,
        id,
      ];
    }
      await pool . query(query,params);

          if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Car not found or not updated",
      });
    }

       res.status(200).json({
            success: true,
            message : "car updated Successfully",
        });
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "error in updating car",
            error: err.message,
        })
    }
}

export const deleteCar = async(req ,res) =>{
    try{
        const {id} = req.params;
        await pool.query("delete from cars where car_id=?",[id]);

          if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }
        res.status(200).json({
            success: true,
            message: "car deleted successfully",
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "error in deleting car",
            error: err.message,
        })
    }
} 
