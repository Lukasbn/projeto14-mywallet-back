import dayjs from "dayjs"
import { newTransitionSchema } from "../schemas/transactions.schemas.js";
import { db } from "../database/database.connection.js";

export async function postNewTransaction(req,res){
    const { value, description } = req.body
    const { tipo } = req.params
    const newValue  = value.replace('.',',')
    const date = dayjs().format("DD/MM")

    const validation = newTransitionSchema.validate(req.body)

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try{
        const sessao = req.locals.sessao

        await db.collection('transactions').insertOne({date, userId: sessao.userId, type: tipo, value: newValue, description})
        res.sendStatus(201)
    }catch(err){
        return res.status(500).send(err.message)
    }
}

export async function gethome(req,res){
    try{
        const sessao = req.locals.sessao

        const transactions = await db.collection('transactions').find({userId: sessao.userId}).toArray()
        transactions.forEach(tr => delete tr.userId)

        let total = 0
        transactions.forEach((tr)=> {
            if(tr.type === 'entrada'){
                total = total + (Number(tr.value.replace(",",".")))
            } else {
                total = total - (Number(tr.value.replace(",",".")))
            }
        })

        const usuario = await db.collection('users').findOne({_id: sessao.userId})

        const response = {transactions, name: usuario.name, total: total.toFixed(2)}


        res.send(response)
    }catch(err){
        return res.status(500).send(err.message)
    }
}