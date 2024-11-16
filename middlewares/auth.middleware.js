const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");

async function Authentication(req,res,next){
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).send({message:"Please login"}); 
    }

    const verifyToken = jwt.verify(token,"secret");

    if(!verifyToken){
        return res.status(401).send({message:"Please login"}); 
    }

    const user = await UserModel.findOne({email:verifyToken.email});

        if(!user){
            return res.status(403).send({message:"User Does Not Exist"});
        }

    req.params.user = user;

    next();
   
}

async function Authorization(allowedRoles) {

    return async function(req,res,next){
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).send({message:"Please login"});
    }

    const verifyToken = jwt.verify(token,"secret");

    const userDetails = await UserModel.findOne({email:verifyToken.email});

    if(!userDetails || !allowedRoles.includes(userDetails.role)){
        return res.status(403).send({message:"Access denied"})
    }

    next();

}
}

async function checkIfAuthor(req,res,next){
    const event_id = req.params.event_id;

    const loginUser = req.params.user;

    try{
        const event = await EventModel.findOne({_id:event_id});

        if(!event){
            return res.status(403).send({message:"Event Does Not Exist"});
        }

        const user = await UserModel.findOne({email:loginUser.email});


        if(!event.manager.includes(user._id)){
            return res.status(403).send({message:"Access denied"});
        }

        next();
    }catch(err){
        res.status(500).send({message:"Internal Server Error"});
    }
}

module.exports = {Authentication, Authorization, checkIfAuthor}