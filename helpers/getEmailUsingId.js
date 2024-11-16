const UserModel = require("../models/user.model");

async function getEmailUsingId(userIds){

    try{
        const convertedArray = userIds.map(async (userId)=>{
            const user = await UserModel.findOne({_id:userId})
            return user.email
        })

        return convertedArray;
    }catch(err){
        return err.message
    }

}

module.exports = {getEmailUsingId}