import {pool} from "../config/db.js";

//list all users

export const listUsers = async (req , res)=>{
    const [data] = await pool .query     
     ("select user_id,name,email,phone,role,is_verified,is_blocked,is_active,created_at from users where role = 'customer'");
     res.json(data);
};

// get single user

export const getUser = async(req ,res)=>{
    const {id} = req.params;
    const [data] = await pool.query("SELECT * FROM users WHERE user_id=?", [id]);
    if(data.length===0){
        return res.status(404).json({ message: "User not found" });
        res.json(data[0]);
    }
}

//block and ublock user

export const toggleBlockUser = async (req,res)=>{
    const {id} = req.params;
    const {block} = req.body;
    const [data] = await pool.query("update users set is_blocked=? where user_id=?",[block ? 1 : 0,id]);
    res.json({
        message:block ? "user blocked successfully" : "user unblocked successfully"
    })
};

// soft delete user

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  await pool.query("UPDATE users SET is_active=0, deleted_at=NOW() WHERE user_id=?", [id]);
  res.json({ message: "User deleted (soft)" });
};

// add user

export const addUser = async (req , res)=>{
    const {name,email,password,phone,role} = req.body;
    const [data] = await pool.query("insert into users (name,email,password,phone,role) VALUES (?,?,?,?,?) ",[name, email, password, phone, role || "customer"]);

    res.json({ message: "User added by admin" });
}