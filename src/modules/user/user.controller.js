import asyncWrapper from '../../../utils/asyncWrapper.js'
import User from '../../../db/models/user.model.js'
import Product from '../../../db/models/product.model.js'
import { findEmail, create, validateRequest, findUByID, update, deleteU, searchSpecificWordsAndAge, searchAge, allUsers, userProducts } from '../../../services/user.services.js'

export const signUp = asyncWrapper(async(req,res)=>{
    const {username,email,password,age,gender,phone} = req.body
    const notAllFields = validateRequest(req)
    if(notAllFields){
        return res.status(400).json({message:'All fields are required'})
    }
    const validEmail = await findEmail(email)
    if(validEmail){
        return res.status(400).json({message:'This email already used'})
    }
    const newUser = await create({username,email,password,age,gender,phone})
    res.status(201).json({message:'User registered successfully',newUser})
})

export const signIn = asyncWrapper(async(req,res)=>{
    const {email,password} = req.body
    const checkEmail = await findEmail(email)
    if(!checkEmail){
        return res.status(404).json({message:'Email or password are wrong'})
    }
    if(checkEmail.password != password){
        return res.status(404).json({message:'Email or password are wrong'})
    }
    res.status(200).json({message:'You are logged successfully'})
})

export const updateUser = asyncWrapper(async(req,res)=>{
    const {username,password,age,phone} = req.body
    const userId = req.query.id
    const userFound = await findUByID(userId)
    if(!userFound){
        return res.status(404).json({message:'User not found'})
    }
    const updatedUser = await update(userId,{username,password,age,phone})
    res.status(200).json({message:'User updated successfully',updatedUser})
})

export const deleteUser = asyncWrapper(async(req,res)=>{
    const userId = req.query.id
    const userFound = await findUByID(userId)
    if(!userFound){
        return res.status(404).json({message:'User not found'})
    }
    await deleteU(userId)
    res.status(200).json({message:'User deleted successfully'})
})

export const searchNameAndAge = asyncWrapper(async(req,res)=>{
    const wordQuery = req.query.word
    const ageQuery = req.query.age
    const users = await searchSpecificWordsAndAge(wordQuery,ageQuery)
    res.status(200).json({message:'Their are result search',users})
})

export const searchAgeBetween = asyncWrapper(async(req,res)=>{
    const age = req.body.age
    const users = await searchAge(age)
    res.status(200).json({message:`This users whose ages is less than ${age[1]} and greater than ${age[0]}`,users})
})

export const listUsers = asyncWrapper(async(req,res)=>{
    const users = await allUsers()
    res.status(200).json({message:'List of all users',users})
})

// export const userProduct = asyncWrapper(async(req,res)=>{
//     const userId = req.query.owner
//     const userProduct = await userProducts(userId)
//     res.status(200).json({message:'Theses are products to owner' , userProduct})
// })