import { findByIDMethod } from "../../db/dbMethods.js"
import User from "../../db/models/user.model.js"
import verifyToken from "../auth/verifyToken.js"



const authMiddleware = ()=>{
    return async(req,res,next)=>{
        let {token} = req.headers
        if(!token){
            return next(new Error('You are not authorized',{cause: 404}))
        }
        if(!token.startsWith(process.env.TOKEN_PREFIX)){
            return next(new Error('Invalid token' , {cause: 400}))
        }

        token = token.split(process.env.TOKEN_PREFIX)[1]

        const payload = verifyToken(token)

        if(!payload || !payload.id){
            return next(new Error('Invalid credentials' , {cause:403}))
        }

        const user = await findByIDMethod(User , payload.id)
        if(!user){
            return next(new Error('Please make registration operation' , {cause:404}))
        }

        req.payload = payload
        next()
    }
}

export default authMiddleware