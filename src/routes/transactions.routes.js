import { Router } from "express"
import { gethome, postNewTransaction } from "../controllers/transactions.controllers.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { newTransitionSchema } from "../schemas/transactions.schemas.js"

const transactionsRouter = Router()

transactionsRouter.post("/nova-transacao/:tipo",validateSchema(newTransitionSchema),postNewTransaction)
transactionsRouter.get("/home",gethome)

export default transactionsRouter