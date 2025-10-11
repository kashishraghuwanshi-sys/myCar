import {pool} from "../config/db.js";
import bcrypt from "bcrypt"


//list all users

export const listUsers = async (req , res)=>{
 try{
     const [data] = await pool .query     
     ("select user_id,name,email,phone,role,is_verified,is_blocked,is_active,created_at from users where role = 'customer'");
     res.status(200).json({
      success: true,
      message: "Customer users fetched successfully",
      total : data.length,
      data,
     });
}
catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: err.message,
    });
  }
};

// get single user

export const getUser = async(req ,res)=>{
  try{
    const {id} = req.params;
    const [data] = await pool.query("SELECT * FROM users WHERE user_id=?", [id]);
    if(data.length===0){
        return res.status(404).json({
          success: false,
          message: "User not found",
         });
    }
        res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: data[0],
    });
  }catch(err){
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: err.message,
    });
  }

  };

//block and ublock user

export const toggleBlockUser = async (req,res)=>{
  try{
    const {id} = req.params;
    const {block} = req.body;
    const [data] = await pool.query("update users set is_blocked=? where user_id=?",[block ? 1 : 0,id]);

      if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success:true,
        message:block 
        ? "user blocked successfully" 
        : "user unblocked successfully"
    });
}
catch(err){
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error updating user block status",
      error: err.message,
    });
}
};

// soft delete user

export const deleteUser = async (req, res) => {
  try{
  const { id } = req.params;
  const [result] = await pool.query("UPDATE users SET is_active=0, deleted_at=NOW() WHERE user_id=?", [id]);

      if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

  res.status(200).json({ 
    success:true,
    message: "User soft deleted successfully"
   });
} catch(err){
      console.error(err);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: err.message,
    });
}
};

// add user

export const addUser = async (req , res)=>{
    const {name,email,password,phone,role} = req.body;
    const [data] = await pool.query("insert into users (name,email,password,phone,role) VALUES (?,?,?,?,?) ",[name, email, password, phone, role || "customer"]);

    res.json({ message: "User added by admin" });
}

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [data] = await pool.query(
      "select user_id,name,email,phone,role,is_verified from users where user_id=?",
      [userId]
    );

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "admin not found",
      });
    }
    const user = data[0];
    res.status(200).json({
      success: true,
      message: "admin profile fetched successfully",
     data:data[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: err.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, password } = req.body;

    if (!name && !phone && !password) {
      return res.status(400).json({
        message: "Please provide at least one field to update",
      });
    }

    //existing user
    const [data] = await pool.query("select * from users where user_id=?", [
      userId,
    ]);

    if (data.length === 0) {
      return res.status(404).json
      ({
        success:false,
        message: "admin not found" 
      });
    }
    const user = data[0];

    // naye values ya purane values
    const updatedName = name || user.name;
    const updatedPhone = phone || user.phone;

    let updatedPassword = user.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(password, salt);
    }

    //update query
    await pool.query(
      "update users set name=?,phone=?,password=? where user_id=?",
      [updatedName, updatedPhone, updatedPassword, userId]
    );

    res.status(200).json({
      success: true,
      message: " admin Profile updated successfully",
      data: {
        user_id: userId,
        name: updatedName,
        email: user.email, // email generally change nahi karte
        phone: updatedPhone,
        role: user.role,
        is_verified: user.is_verified,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "error updating profile",
      error: err.message,
    });
  }
};

