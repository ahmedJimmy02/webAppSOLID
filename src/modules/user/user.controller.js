import asyncWrapper from '../../../utils/asyncWrapper.js'
import * as dbMethods from '../../../db/dbMethods.js'
import User from '../../../db/models/user.model.js'
import Product from '../../../db/models/product.model.js'

export const signUp = asyncWrapper(async(req,res)=>{
    const {username,email,password,age,gender,phone} = req.body
    const isEmailDuplicate = await dbMethods.findOneMethod(User,{email:email})
    if(isEmailDuplicate){
        return res.status(400).json({message:'This email already used'})
    }
    const newUser = await dbMethods.createMethod(User,{username,email,password,age,gender,phone})
    if(!newUser){
        return res.status(400).json({message:'Signup failed'})
    }
    res.status(201).json({message:'User registered successfully',newUser})
})

export const signIn = asyncWrapper(async(req,res)=>{
    const {email,password} = req.body
    const user = await dbMethods.findOneMethod(User,'email' , email)
    if(!user){
        return res.status(404).json({message:'Email or password are wrong'})
    }
    const checkPassword = dbMethods.checkPasswordMethod(user,password)
    if(checkPassword){
        return res.status(401).json({message:'Email or password are wrong'})
    }
    res.status(200).json({message:'You are logged successfully'})
})

export const updateUser = asyncWrapper(async(req,res)=>{
    const {username,password,age,phone} = req.body
    const userId = req.query.id
    const userFound = await dbMethods.findByIDMethod(User,userId)
    if(!userFound){
        return res.status(404).json({message:'User not found'})
    }
    const updatedUser = await dbMethods.updateOneMethod(User,userId,{username,password,age,phone})
    if(!updatedUser){
        return res.status(400).json({message:'Update failed'})
    }
    res.status(200).json({message:'User updated successfully'})
})

export const deleteUser = asyncWrapper(async(req,res)=>{
    const userId = req.query.id
    const userFound = await dbMethods.findByIDMethod(User,userId)
    if(!userFound){
        return res.status(404).json({message:'User not found'})
    }
    const deletedAccount = await dbMethods.deleteOneMethod(User,userId)
    if(!deletedAccount){
        return res.status(400).json({message:'Deletion failed'})
    }
    res.status(200).json({message:'User deleted successfully'})
})

export const searchNameAndAge = asyncWrapper(async(req,res)=>{
    const wordQuery = req.query.word
    const ageQuery = req.query.age
    const users = await dbMethods.searchWithNameAndAgeMethod(User,wordQuery,ageQuery)
    res.status(200).json({message:'Their are result search',users})
})

export const searchAgeBetween = asyncWrapper(async(req,res)=>{
    const age = req.body.age
    const users = await dbMethods.searchWithArrayOfAges(User,age)
    res.status(200).json({message:`This users whose ages is less than ${age[1]} and greater than ${age[0]}`,users})
})

export const listUsers = asyncWrapper(async(req,res)=>{
    const users = await dbMethods.findAllMethod(User)
    res.status(200).json({message:'List of all users',users})
})

export const userProduct = asyncWrapper(async(req,res)=>{
    const userId = req.query.owner
    const userProduct = await dbMethods.searchUserProducts(Product,userId)
    res.status(200).json({message:'Theses are products to owner' , userProduct})
})