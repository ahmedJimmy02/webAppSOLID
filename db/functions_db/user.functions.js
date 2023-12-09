import User from "../models/user.model.js"
import Product from "../models/product.model.js"

export function validateRequest (req){
    const {username,email,password,age,gender,phone} = req.body
    if(!username||!email||!password||!age||!gender||!phone){
        return 'All fields are required'
    }
}

export function correctPassword(user,password){
    if(user.password != password){
        return 'You are not authorized'
    }
    return 
}

export async function findEmail(email){
    const validEmail = await User.findOne({email:email})
    return validEmail
}

export async function create(userData){
    await User.create(userData)
}

export async function findUByID(userId){
    const user = await User.findById(userId)
    return user
}

export async function update(userId,info){
    const updated = await User.findByIdAndUpdate(
        userId,
        {$set:info},
        {new:true}
    )
    return updated
}

export async function deleteU(userId){
    await User.deleteOne({_id:userId})
}

export async function searchSpecificWordsAndAge(wordQuery,ageQuery){
    const result = await User.find({
        username:{
            $regex: new RegExp(wordQuery)
        },
        age:{
            $lt:ageQuery
        }
    })
    return result
}

export async function searchAge(age){
    const users = await User.find({
        age:{
            $gt:age[0],
            $lt:age[1]
        }
    })
    return users
}

export async function allUsers(){
    const users = await User.find()
    return users
}

export async function userProducts(userId){
    const userPros = await Product.find({userId:userId})
    return userPros
}