import {pool} from "../config/db.js";

// get all rentals(admin)

export const getAllRentals = async (req ,res)=>{
    try{
        const [rentals] = await pool.query(`SELECT r.*, u.name AS user_name, c.brand, c.model, c.status AS car_status
       FROM rentals r
       JOIN users u ON r.user_id = u.user_id
       JOIN cars c ON r.car_id = c.car_id
       ORDER BY r.created_at DESC`);
    
    res.json(rentals);
}
catch(err){
    res.status(500).json({
        message: err.message
    });
}
};

// make car available (return)
export const makeCarAvailable = async(req ,res)=>{
    const {car_id} = req.params;

    try{
        // updated car status
        await pool.query(
            "updated rentals set is_completed=1 where car_id=? AND is_completed=0",
            [car_id]
        );

        res.json({
            message : " Car is now Availalbe"
        });
    }
    catch(err){
        res.status(500).json({
            message : err.message
        });
    }
};

// cancel rental (admin)

export const cancelRental = async (req ,res)=>{
    const {rental_id} = req.params;
    try{

        // get car_id from rental
        const [rental] = await pool.query("select car_id from rentals where rental_id=? ",[rental_id]);
        if(rental.length === 0){
            return res.status(404).json({
                message : "rental not found"
            });
        }

        const car_id = rental[0].car_id;

        //delete rental
        await pool.query("DELETE FROM rentals WHERE rental_id = ?",[rental_id]);

        // make car available
        await pool.query("update cars Set status='Available' where car_id=?",[car_id]);

        res.json({
            message: "Rental canceled and car is now available"
        });
    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
    }
};