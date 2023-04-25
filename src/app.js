import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { MongoClient, ObjectId } from "mongodb"
import joi from "joi"
import bcrypt, { compareSync } from "bcrypt"
import { v4 as uuid } from "uuid"
import dayjs from "dayjs"

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

app.post("/", async (req,res)=>{

    const { email, password } = req.body

    const loginSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(3).required()
    })

    const validation = loginSchema.validate(req.body)

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try{
        const registredUser = await db.collection('users').findOne({email: email})

        if(!registredUser) return res.status(404).send("E-mail não cadastrado!")
        if(!bcrypt.compareSync(password,registredUser.password)) return res.status(401).send("Senha invalida!")
        
        const token = uuid()
        
        await db.collection("sessions").insertOne({userId: registredUser._id, token})

        return res.status(200).send(token)
    }catch (err){
        return res.status(500).send(err.message)
    }

})

app.post("/nova-transacao/:tipo", async (req,res)=>{
    const { value, description } = req.body
    const { tipo } = req.params
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    const newValue  = value.replace('.',',')
    const date = dayjs().format("DD/MM")
    console.log(date)

    const newTransitionSchema = joi.object({
        value: joi.number().precision(2).positive().required(),
        description: joi.string().required()
    })

    const validation = newTransitionSchema.validate(req.body)

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    if(!token) return res.sendStatus(401)

    try{
        const sessao = await db.collection('sessions').findOne({token})
        if(!sessao) return res.sendStatus(401)

        console.log(sessao.userId)

        await db.collection('transactions').insertOne({date, userId: sessao.userId, type: tipo, value: newValue, description})
        res.sendStatus(201)
    }catch(err){
        return res.status(500).send(err.message)
    }
})

const PORT = 5000
app.listen(PORT, () => console.log(`app running on port ${PORT}`))

