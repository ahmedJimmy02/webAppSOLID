import asyncWrapper from '../../../utils/asyncWrapper.js'
import * as dbMethods from '../../../db/dbMethods.js'
import Product from '../../../db/models/product.model.js'
import User from '../../../db/models/user.model.js'

export const addProduct = asyncWrapper(async(req,res)=>{
    const {name,description,price,userId} = req.body
    const userFound = await dbMethods.findByIDMethod(User,userId)
    if(!userFound){
        return res.status(404).json({message:'User not found'})
    }
    const newProduct = await dbMethods.createMethod(Product,{name,description,price,userId})
    if(!newProduct){
        return res.status(400).json({message:'created Failed'})
    }
    res.status(201).json({message:'Product added successfully', newProduct})
}) 

export const listProduct = asyncWrapper(async(req,res)=>{
    const products = await dbMethods.findAllMethod(Product)
    res.status(200).json({message:'All products',products})
})

export const updateProduct = asyncWrapper(async(req,res)=>{
    const {name,description,price} = req.body
    const owner = req.query.owner
    const productId = req.query.productId
    const productFound = await dbMethods.findByIDMethod(Product,productId)
    if(!productFound){
        return res.status(404).json({message:'Product not found'})
    }
    const notValidOwner = dbMethods.checkIsThisOwnerOrNot(productFound,owner)
    if(!notValidOwner.success){
        return res.status(400).json({message:'You are not authorized'})
    }
    const updatedProduct = await dbMethods.updateOneMethod(Product,productId,{name,price,description})
    if(!updatedProduct){
        return res.status(400).json({message:'update failed'})
    }
    res.status(200).json({message:'Product updated successfully'})
})

export const deleteProduct = asyncWrapper(async(req,res)=>{
    const owner = req.query.owner
    const productId = req.query.productId
    const productFound = await dbMethods.findByIDMethod(Product,productId)
    if(!productFound){
        return res.status(404).json({message:'Product not found'})
    }
    const notOwnerValid = dbMethods.checkIsThisOwnerOrNot(productFound,owner)
    if(!notOwnerValid.success){
        return res.status(400).json({message:'You are not authorized'})
    }
    const deletedProductApply = await dbMethods.deleteOneMethod(Product,productId)
    if(!deletedProductApply){
        return res.status(400).json({message:'deleted failed'})
    }
    res.status(200).json({message:'Product deleted successfully'})
})

export const getAllProductsWithOwners = asyncWrapper(async(req,res)=>{
    const products = await dbMethods.getProductsWithOwnerInfo(Product , 'userId')
    res.status(200).json({message:'Products and their owners information',products})
})

export const sortProducts = asyncWrapper(async(req,res)=>{
    const sortedProducts = await dbMethods.getSortedDescendingByCreatedAt(Product)
    res.status(200).json({message:'Products sorted descending by createdAt field',sortedProducts})
})

export const productWithOwnersUsingLookup = asyncWrapper(async(req,res)=>{
    const products = await dbMethods.getProductsWithOwnerInfoUsingLookUp(Product,'users','userId','_id','userData')
    res.status(200).json({message:'Products and their owners using lookup',products})
})

export const retrieveNumberOfDocuments = asyncWrapper(async(req,res)=>{
    const result = await dbMethods.getNumberOfDocument(Product)
    res.status(200).json({message:'This is the number of documents in model' , result})
})