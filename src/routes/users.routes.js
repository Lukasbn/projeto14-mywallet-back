import { Router } from "express"
import { postLogin, postSignIn } from "../controllers/users.controllers.js"

const usersRouter = Router()

usersRouter.post("/cadastro", postSignIn)
usersRouter.post("/", postLogin)

export default usersRouter