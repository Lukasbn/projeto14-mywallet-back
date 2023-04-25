import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import usersRouter from "./routes/users.routes.js"
import transactionsRouter from "./routes/transactions.routes.js"
dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(usersRouter)
app.use(transactionsRouter)

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`app running on port ${port}`))

