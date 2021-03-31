const Joi = require('joi');

module.exports.playerSchema = Joi.object({
    player: Joi.object({
        name: Joi.string().required(),
        Test: Joi.number().required().min(0),
        ODI: Joi.number().required().min(0),
        T20: Joi.number().required().min(0),
        about: Joi.string().required(),
        image: Joi.string().required()
    }).required()
});