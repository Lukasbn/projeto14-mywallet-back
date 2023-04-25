import bcrypt, { compareSync } from "bcrypt"
import { v4 as uuid } from "uuid"
import { loginSchema, signUpSchema } from "../schemas/users.schemas.js";
import { db } from "../database/database.connection.js";

export async function postSignIn(req,res) {
    const { name, email, password } = req.body
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
}

export async function postLogin(req,res){
    const { email, password } = req.body

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

}