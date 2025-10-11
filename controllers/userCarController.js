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


