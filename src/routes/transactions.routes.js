import { Router } from "express"
import { gethome, postNewTransaction } from "../controllers/transactions.controllers.js"

const transactionsRouter = Router()

transactionsRouter.post("/nova-transacao/:tipo",postNewTransaction)
transactionsRouter.get("/home",gethome)

export default transactionsRouter