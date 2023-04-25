import { Router } from "express"
import { gethome, postNewTransaction } from "../controllers/transactions.controllers.js"
import { authorizationValidation } from "../middlewares/autorization.middleware.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { newTransitionSchema } from "../schemas/transactions.schemas.js"

const transactionsRouter = Router()

transactionsRouter.post("/nova-transacao/:tipo",validateSchema(newTransitionSchema),authorizationValidation,postNewTransaction)
transactionsRouter.get("/home", authorizationValidation,gethome)

export default transactionsRouter