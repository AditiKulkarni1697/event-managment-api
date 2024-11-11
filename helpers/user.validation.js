const Joi = require("joi");

const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

async function userValidation(req,res,next){
    const validationResult = schema.validate(req.body);

    if(validationResult.error){
        return res.status(400).send({
            message: 'Invalid registration data. Please check your input.',
          });
    }

    next();
};

module.exports = {userValidation};