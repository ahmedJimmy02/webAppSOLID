import { findByIDMethod } from "../../db/dbMethods.js"
import User from "../../db/models/user.model.js"
import asyncWrapper from '../../utils/asyncWrapper.js'
import verifyToken from "../auth/verifyToke.js"


const isAuthenticated = asyncWrapper(async(req,res,next)=>{
    let {token} = req.headers
    if(!token){
        return next(new Error('Forbidden', {cause:403}))
    }
    // check prefix
    if(!token.startsWith(process.env.TOKE_PREFIX)){
        return next(new Error('Invalid token',{cause:400}))
    } 
    token = token.split(process.env.TOKE_PREFIX)[1]

    const payload = verifyToken(token)
    const user = await findByIDMethod(User , payload.id)
    if(!user){
        return next(new Error('User not found' , {cause:404}))
    }
    req.payload = payload
    next()
})

export default isAuthenticated