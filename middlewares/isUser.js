export const isUser = (req , res ,next)=>{
    try{
        if(req.user && req.user.role === "customer"){
            return next();
        }
        return res.status(403).json({
            message: "Access denied. users only."
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        });
    };
    
}