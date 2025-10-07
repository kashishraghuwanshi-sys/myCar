import {pool} from "../config/db.js";

export const createPayment = async (req ,res)=>{
  try{
 
  
 
    const rental_id = req.params.rental_id;
    const user_id = req.user.id;



    // rental check

    const [rental] =await pool.query(
      "select * from rentals where rental_id = ? and user_id=?",[rental_id,user_id]
    );

    if(rental.length === 0){
      return res.status(404).json({
        message: "Rental not found"
      })
    }

    // payment simulation 

    const totalAmount = rental[0].total_price;

    //update rental table to mark as paid

    await pool.query("update rentals set is_paid=1,payment_status='paid' where rental_id=?",[rental_id]);

    
    // 4️⃣ Insert into payments table
     await pool.query(
      "INSERT INTO payments (rental_id, user_id, amount, payment_method, status, payment_date) VALUES (?, ?, ?, ?, ?, NOW())",
      [rental_id, user_id, totalAmount, "dummy", "Success"]
    );
    
    
    res.status(200).json({
      message:"✅ Payment successful (fake mode)",
      rental_id,
      totalAmount,
      payment_status: "paid",

    });

  }
  catch(err){
    console.log("payment error:",err);
    res.status(500).json({
      message: err.message
    });
  }
};

// step 2 refund simulation

export const refundPayment = async(req ,res)=>{
  try{
    const rental_id = req.params.rental_id;
    const user_id = req.user.id;

    //check rental

    const [rental] = await pool.query("select * from rentals where rental_id = ? and user_id =?",
      [rental_id, user_id]

    );

      if (rental.length === 0) {
      return res.status(404).json({ message: "Rental not found" });

    }

    // Refund simulation: just update columns

   await pool.query(
      "UPDATE rentals SET is_paid = 0, payment_status = 'Refunded', status = 'Cancelled' WHERE rental_id = ?",
      [rental_id]
    ); 

    
    await pool.query(
      "UPDATE payments SET status = 'Refunded' WHERE rental_id = ? AND user_id = ?",
      [rental_id, user_id]
    );

    
    // Car available again
    await pool.query("UPDATE cars SET status = 'Available' WHERE car_id = ?", [
      rental[0].car_id,
    ]);
 
     res.status(200).json({
      message: "💸 Refund processed successfully (fake mode)",
      rental_id,
    });
}
catch (err) {
    console.error("Refund Error:", err);
    res.status(500).json({ message: err.message });
  }
};