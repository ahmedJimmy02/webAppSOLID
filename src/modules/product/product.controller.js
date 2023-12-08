import asyncWrapper from '../../../utils/asyncWrapper.js'
import Product from '../../../db/models/product.model.js'
import User from '../../../db/models/user.model.js'


export const addProduct = asyncWrapper(async(req,res)=>{
    const {name,description,price,userId} = req.body
    if(!name||!description||!price||!userId){
        return res.status(400).json({message:'All fields are required'})
    }
    const userFound = await User.findById(userId)
    if(!userFound){
        return res.status(404).json({message:'User not found'})
    }
    const newProduct = await Product.create({name,description,price,userId})
    res.status(201).json({message:'Product added successfully', newProduct})
})

export const listProduct = asyncWrapper(async(req,res)=>{
    const products = await Product.find()
    res.status(200).json({message:'All products',products})
})

export const updateProduct = asyncWrapper(async(req,res)=>{
    const {name,description,price} = req.body
    const owner = req.query.owner
    const productId = req.query.productId
    const productFound = await Product.findById(productId)
    if(!productFound){
        return res.status(404).json({message:'Product not found'})
    }
    if(productFound.userId != owner){ 
        return res.status(404).json({message:'You are not authorized'})
    }
    const updateProduct = await Product.findByIdAndUpdate(
        productId,
        {$set:{name,description,price}},
        {new:true}
    )
    res.status(200).json({message:'Product updated successfully',updateProduct})
})

export const deleteProduct = asyncWrapper(async(req,res)=>{
    const owner = req.query.owner
    const productId = req.query.productId
    const productDeleted = await Product.findOneAndDelete({
        $and:[
            {_id:productId},
            {userId:owner}
        ]
    })
    if(!productDeleted){
        return res.status(400).json({message:'Delete fail'})
    }
    res.status(200).json({message:'Product deleted successfully'})
})

export const getAllProductsWithOwners = asyncWrapper(async(req,res)=>{
    const products = await Product.find().populate('userId')
    res.status(200).json({message:'Products and their owners information',products})
})

export const sortProducts = asyncWrapper(async(req,res)=>{
    const sortedProducts = await Product.find().sort({createdAt:-1})
    res.status(200).json({message:'Products sorted descending by createdAt field',sortedProducts})
})