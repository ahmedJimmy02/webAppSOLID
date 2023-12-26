import asyncWrapper from '../../../utils/asyncWrapper.js'
import * as dbMethods from '../../../db/dbMethods.js'
import User from '../../../db/models/user.model.js'
import Product from '../../../db/models/product.model.js'
import generateToken from '../../auth/generateToken.js'
import hashedPasswordMethod from '../../auth/hashedPasswordMethod.js'
import comparePassword from '../../auth/comparePassword.js'
import { sendEmails } from '../../../utils/sendEmail.js'
import verifyToken from '../../auth/verifyToken.js'


export const signUp = asyncWrapper(async(req,res,next)=>{
    const {username,email,password,age,gender,phone} = req.body

    const isEmailDuplicate = await dbMethods.findOneMethod(User,{email:email})
    if(isEmailDuplicate){
        return next(new Error('This email already used'))
    }

    const hashedPassword = hashedPasswordMethod(password)

    const newUser = await dbMethods.createMethod(User,{username,email,password:hashedPassword,age,gender,phone})
    if(!newUser){
        return next(new Error('Signup failed'))
    }

    const token = generateToken({email:newUser.email})
    // send email
    const messageSent = await sendEmails({
        to:newUser.email , 
        subject:'Account Activation',
        html:`<a href='http://localhost:3000/activate_account/${token}'>Activate your account</a>`
    })

    if(!messageSent){
        return next(new Error('Email is invalid',{cause:400}))
    }

    res.status(201).json({message:'User registered successfully',newUser})
})

export const activateAccount = asyncWrapper(async(req,res,next)=>{
    const {token} = req.params

    const payload = verifyToken(token)

    await User.findOneAndUpdate({email:payload.email} , {$set:{isConfirmed:true} ,})

    return res.status(200).json({message:'Email activation done successfully'})
})

export const signIn = asyncWrapper(async(req,res,next)=>{
    const {email,password} = req.body
    const user = await dbMethods.findOneMethod(User,{email:email})
    if(!user){
        return next(new Error('Invalid credentials'))
    }

    if(!user.isConfirmed) return next(new Error('You should to activate your account first',{cause:400}))

    const checkPassword = comparePassword(password , user.password)

    if(!checkPassword){
        return next(new Error('Invalid credentials'))
    }

    const token = generateToken({id:user._id , email:user.email})

    const agent = req.headers['user-agent']
    const IPAddress = req.ip

    await dbMethods.updateOneMethod(User, user._id ,{agent , IPAddress})
    
    res.status(200).json({message:'You are logged successfully' , token})
})

export const updateUser = asyncWrapper(async(req,res,next)=>{
    const {username,password,age,phone} = req.body
    const userId = req.payload.id
    const updatedUser = await dbMethods.updateOneMethod(User,userId,{username,password,age,phone})
    if(!updatedUser){
        return next(new Error('Update failed' , {cause:400}))
    }
    res.status(200).json({message:'User updated successfully'})
})

export const deleteUser = asyncWrapper(async(req,res,next)=>{
    const userId = req.payload.id
    const deletedAccount = await dbMethods.deleteOneMethod(User,userId)
    if(!deletedAccount){
        return next(new Error('Deletion failed' , {cause:400}))
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
    const userId = req.payload.id
    const userProduct = await dbMethods.searchUserProducts(Product,userId)
    res.status(200).json({message:'Theses are products to owner' , userProduct})
})
