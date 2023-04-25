import joi from "joi"

export const signUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required().min(3)
})

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(3).required()
})