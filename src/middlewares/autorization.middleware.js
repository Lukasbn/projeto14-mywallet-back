import { db } from "../database/database.connection"

export async function authorizationValidation(req,res,next){
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    if(!token) return res.sendStatus(401)

    try{
        const sessao = await db.collection('sessions').findOne({token})
        if(!sessao) return res.sendStatus(401)

        res.locals.sessao=sessao

        next()
    }catch(err){
        return res.status(500).send(err.message)
    }
}