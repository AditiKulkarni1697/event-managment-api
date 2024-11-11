const {UserModel} = require("../models/user.model");
const bcrypt = require("bcrypt");

async function userRegistration(req,res,next){
    const {name,email,password} = req.body;
try{
    const hash = await bcrypt.hash(password, 8);
    
    const user = new UserModel({name, email, password:hash});
    await user.save();

    res.status(201).send({message:"User registered successfully"})

}catch(err){
    res.status(500).send({message:"Internal server error"})
}
};



module.exports = {userRegistration};