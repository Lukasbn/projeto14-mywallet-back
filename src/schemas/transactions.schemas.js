import joi from "joi"

export const newTransitionSchema = joi.object({
    value: joi.number().precision(2).positive().required(),
    description: joi.string().required()
})