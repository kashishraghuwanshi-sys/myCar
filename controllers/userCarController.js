import { pool } from "../config/db.js";

// get all available cars

export const getAvailableCars = async (req, res) => {
  try {
    const [cars] = await pool.query(
      "select * from cars where status = 'Available'"
    );
    return res.status(200).json({
      success: true,
      count: cars.length,
      data: cars,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// search cars

export const searchCars = async (req, res) => {
  try {
    const { brand, fuel_type, seating_capacity, min_price, max_price } =
      req.query;
    let query = "SELECT * FROM cars WHERE status = 'Available'";
    let params = [];

    if (brand) {
      query += "And brand like ?";
      params.push(`%${brand}%`);
    }
    if (fuel_type) {
      query += " AND fuel_type = ?";
      params.push(fuel_type);
    }

    if (seating_capacity) {
      query += " AND seating_capacity = ?";
      params.push(seating_capacity);
    }

    if (min_price) {
      query += " AND rent_per_day >= ?";
      params.push(min_price);
    }
    if (max_price) {
      query += " AND rent_per_day <= ?";
      params.push(max_price);
    }

    const [cars] = await pool.query(query, params);

     if (cars.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No cars found matching your criteria.",
      });
    }

    return res.status(200).json({
      success: true,
      count: cars.length,
      data: cars,
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message });
  }
};

// 3. Get single car details
export const getCarDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const [car] = await pool.query("SELECT * FROM cars WHERE car_id = ?", [id]);
    if (car.length === 0)
    return res.status(404).json({ 
    success: false,
    message: "Car not found" 
  });
      return res.status(200).json({
      success: true,
      data: car[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
       message: error.message
       });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { user_id, car_id } = req.body;

    // ✅ Validate input
    if (!user_id || !car_id) {
      return res.status(400).json({
        success: false,
        message: "user_id and car_id are required",
      });
    }

    // ✅ Check if already exists in wishlist
    const [existing] = await pool.query(
      "SELECT * FROM wishlist WHERE user_id = ? AND car_id = ?",
      [user_id, car_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Car is already in your wishlist",
      });
    }

    // ✅ Insert new wishlist item
    await pool.query(
      "INSERT INTO wishlist (user_id, car_id) VALUES (?, ?)",
      [user_id, car_id]
    );

    res.status(201).json({
      success: true,
      message: "Car added to wishlist successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to add to wishlist",
      error: err.message,
    });
  }
};

export const getWishlist = async(req,res)=>{
  try{
    const {user_id}= req.params;
    const [rows] = await pool.query(
      `SELECT w.*, c.brand, c.model, c.rent_per_day, c.image_url
       FROM wishlist w
       JOIN cars c ON w.car_id = c.car_id
       WHERE w.user_id = ?`,[user_id]
    );

    res.status(200).json({
      success:true,
      message:"wishlist get successfully",
      wishlist:rows,
    })
  }
  catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    });
  }
};

export const removeFromWishlist = async(req,res)=>{
  try{
    const{user_id,car_id}=req.params;

      const [item] = await pool.query(
      "SELECT * FROM wishlist WHERE user_id = ? AND car_id = ?",
      [user_id, car_id]
    );
       if (item.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found in wishlist",
      });
    }
    await pool.query("delete from wishlist where user_id=? and car_id=?",[user_id,car_id]);

    res.status(200).json({
      success:true,
      message:"car removed from wishlist successfully",
    })
  }
  catch(err){
      res.status(500).json({ success: false, message: err.message });
  }

}


