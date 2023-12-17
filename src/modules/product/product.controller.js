import asyncWrapper from '../../../utils/asyncWrapper.js'
import * as dbMethods from '../../../db/dbMethods.js'
import Product from '../../../db/models/product.model.js'
import User from '../../../db/models/user.model.js'

export const addProduct = asyncWrapper(async(req,res,next)=>{
    const {name,description,price} = req.body
    const userId = req.payload.id
    const newProduct = await dbMethods.createMethod(Product,{name,description,price,userId})
    if(!newProduct){
        return next(new Error('Created Failed' , {cause:400}))
    }
    res.status(201).json({message:'Product added successfully', newProduct})
}) 

export const listProduct = asyncWrapper(async(req,res)=>{
    const products = await dbMethods.findAllMethod(Product)
    res.status(200).json({message:'All products',products})
})

export const updateProduct = asyncWrapper(async(req,res,next)=>{
    const {name,description,price} = req.body
    const owner = req.payload.id
    const productId = req.query.productId
    const productFound = await dbMethods.findByIDMethod(Product,productId)
    if(!productFound){
        return next(new Error('Product not found', {cause:404}))
    }
    const notValidOwner = dbMethods.checkIsThisOwnerOrNot(productFound,owner)
    if(!notValidOwner.success){
        return next(new Error('You are not authorized' , {cause:401}))
    }
    const updatedProduct = await dbMethods.updateOneMethod(Product,productId,{name,price,description})
    if(!updatedProduct){
        return next(new Error('Update failed' , {cause:400}))
    }
    res.status(200).json({message:'Product updated successfully'})
})

export const deleteProduct = asyncWrapper(async(req,res,next)=>{
    const owner = req.payload.id
    const productId = req.query.productId
    const productFound = await dbMethods.findByIDMethod(Product,productId)
    if(!productFound){
        return next(new Error('Product not found', {cause:404}))
    }
    const notOwnerValid = dbMethods.checkIsThisOwnerOrNot(productFound,owner)
    if(!notOwnerValid.success){
        return next(new Error('You are not authorized' , {cause:403}))
    }
    const deletedProductApply = await dbMethods.deleteOneMethod(Product,productId)
    if(!deletedProductApply){
        return next(new Error('Updated failed' , {cause:400}))
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

/**apply virtual populate */
export const virtualPopulate = asyncWrapper(async(req,res)=>{
    const {_id} = req.query
    const data = await Product.findById({_id}).populate({path:'userId'})
    res.status(200).json({message:'virtual populate' ,data , Owner: data.userId.virtualUserName})
})