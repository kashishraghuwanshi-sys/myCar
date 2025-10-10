import {pool} from "../config/db.js"
import { upload } from "../config/cloudinaryConfig.js";
import { query } from "express-validator";

export const addCar = async(req , res)=>{
    try{
        const {brand,model,year,fuel_type,seating_capacity,price,rent_per_day,status} = req.body;

        const imageUrl = req.file?.path;

        const query = "insert into cars (brand, model,year,fuel_type,seating_capacity,price,rent_per_day,status,image_url)values(?,?,?,?,?,?,?,?,?)";

        const [result] = await pool.query(query,[
            brand,model,year,fuel_type,seating_capacity,price,rent_per_day,status || 'Available',imageUrl,

        ]);

        res.status(201).json({
            message: "car added successfully",
            car_id : result.insertId,
            image_url:imageUrl,
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"error adding car",
            error:err.msg
        })
    }
};

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

export const getCarById = async(req,res)=>{
    try{
        const {id} = req.params;
        const [cars] = await pool.query("select * from cars where car_id=?",[id]);

        if(cars.length===0){
            return res.status(404).json({
                message: "car not found"
            })
        }
        res.status(200).json({car:cars[0]});
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: "Error fetching car"
        });
    }
}

export const updateCar = async(req ,res)=>{
    try{
        const {id} = req.params;
        const {brand, model, year, fuel_type, seating_capacity, price, rent_per_day, status} = req.body;

        

        if (req.file){
            // agar image upload hui hain

            const imageUrl = req.file.path;
        

        const query = "UPDATE cars SET brand=?, model=?, year=?, fuel_type=?, seating_capacity=?, price=?, rent_per_day=?, status=?, image_url=? WHERE car_id=?";

        const [data] = await pool.query(query,[brand, model, year, fuel_type, seating_capacity, price, rent_per_day, status,imageUrl,id]);

        }
        else{
             // Sirf details update
             query =
        "UPDATE cars SET brand=?, model=?, year=?, fuel_type=?, seating_capacity=?, price=?, rent_per_day=?, status=? WHERE car_id=?";
      params = [
        brand,
        model,
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
       res.status(200).json({
            message : "car updated Successfully"
        });
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({
            message: "error in updating car"
        })
    }
}

export const deleteCar = async(req ,res) =>{
    try{
        const {id} = req.params;
        await pool.query("delete from cars where car_id=?",[id]);
        res.status(200).json({
            message: "car deleted successfully"
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: "error in deleting car"
        })
    }
} 
