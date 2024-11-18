const {UserModel} = require("../models/user.model");
const logger = require("./logger");

async function getEmailUsingId(userIds){

    try{
        const convertedArray = userIds.map(async (userId)=>{
            const user = await UserModel.findOne({_id:userId})
            return user.email
        })

        return convertedArray;
    }catch(err){
logger.error(err.message);
        return err.message
    }

}

module.exports = {getEmailUsingId}