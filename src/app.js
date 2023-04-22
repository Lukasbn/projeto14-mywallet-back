import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { MongoClient } from "mongodb"
import joi from "joi"
import bcrypt from "bcrypt"

const app = express()

app.use(express.json())
app.use(cors())

dotenv.config()

let db
const mongoClient = new MongoClient(process.env.DATABASE_URL)

mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message))

app.post("/cadastro", async (req,res)=> {

    const { name, email, password } = req.body

    const signUpSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required().min(3)
    })

    const validation = signUpSchema.validate(req.body)

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    const hashedPassword = bcrypt.hashSync(password,10)

    const newuser = {
        name,
        email,
        password: hashedPassword
    }

    try{
        const registredUser = await db.collection('users').findOne({email: email})
        if(registredUser)return res.status(409).send("Esse email já está cadastrado!")

        await db.collection('users').insertOne(newuser)

        return res.sendStatus(201)
    }catch (err){
        return res.status(500).send(err.message)
    }
})


const PORT = 5000
app.listen(PORT, () => console.log(`app running on port ${PORT}`))

