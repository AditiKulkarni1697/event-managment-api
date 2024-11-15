
const {EventModel} = require("../models/event.model");

async function createEvent(req,res,next){
    const {title,date, time, desc} = req.body;

    try{
        const event = await EventModel({title,date, time, desc});       
        await event.save(); 

        res.status(201).send({message:"Event created successfully"});
    }catch(err){
        res.status(500).send({message:"Internal Server error"});        
    }
}

async function updateEvent(req,res,next){
    const event_id = req.params.event_id;

    try{
        
    }catch(err){

    }    

}


module.exports = {createEvent, updateEvent}