import { pool } from "../config/db.js";

// book a car

export const bookCar = async (req, res) => {
  try {
    const { car_id, start_date, end_date } = req.body;
    const user_id = req.user.id;

    console.log("car_id:", car_id);
    console.log("user_id:", user_id);
    console.log("start_date:", start_date, "end_date:", end_date);


    // check if car is available
    const [carData] = await pool.query(
      "select * from cars where car_id =? And status= 'Available' ",
      [car_id]
    );

    if (carData.length === 0) {
      return res.status(400).json({ message: "Car not available" });
    }

    // calculate rental days

    const start = new Date(start_date);
    const end = new Date(end_date);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return res.status(400).json({ message: "Invalid rental period" });
    }

    const total_price = days * carData[0].rent_per_day;

    // insert rental record

    await pool.query(
      "insert into rentals(user_id, car_id, start_date, end_date, total_price) values(?, ?, ?, ?, ?)",
      [user_id, car_id, start_date, end_date, total_price]
    );

    //update car status to rented

    await pool.query("update cars set status='Rented' where car_id=?", [
      car_id,
    ]);

    res.json({
      message: "car booked successfully",
      total_price,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// get user Rentals
export const getUserRentals = async (req, res) => {
  try {
    const user_id = req.user.id;
    const [rentals] = await pool.query(
      `SELECT r.*, c.brand, c.model, c.fuel_type, c.seating_capacity 
       FROM rentals r 
       JOIN cars c ON r.car_id = c.car_id 
       WHERE r.user_id = ? 
       ORDER BY r.created_at DESC`,
      [user_id]
    );
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== Cancel a Rental ==========
export const cancelRental = async (req, res) => {
  try {
    const { rental_id } = req.params;
    const user_id = req.user.id;

    // Get rental info
    const [rental] = await pool.query(
      "SELECT * FROM rentals WHERE rental_id=? AND user_id=?",
      [rental_id, user_id]
    );

    if (rental.length === 0) {
      return res.status(404).json({ message: "Rental not found" });
    }

    const car_id = rental[0].car_id;

    // soft Delete rental record
    await pool.query("update rentals set status='Cancelled' where rental_id=?", [rental_id]);

    // Make car available again
    await pool.query("UPDATE cars SET status='Available' WHERE car_id=?", [
      car_id,
    ]);

    res.json({ message: "Rental canceled and car is now available" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
