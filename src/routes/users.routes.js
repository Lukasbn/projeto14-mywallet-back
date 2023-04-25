import { Router } from "express"
import { postLogin, postSignIn } from "../controllers/users.controllers.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { loginSchema, signUpSchema } from "../schemas/users.schemas.js"

const usersRouter = Router()

usersRouter.post("/cadastro", validateSchema(signUpSchema),postSignIn)
usersRouter.post("/", validateSchema(loginSchema),postLogin)

export default usersRouter