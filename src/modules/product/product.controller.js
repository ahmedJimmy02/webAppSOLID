import asyncWrapper from '../../../utils/asyncWrapper.js'
import Product from '../../../db/models/product.model.js'
import User from '../../../db/models/user.model.js'
import { checkOwner, createProduct, deleteOneProduct, findPById, findProducts, productsWithOwners, sortByCreatedAt, updateProducts, validateRequestNote } from '../../../services/product.services.js'
import { findUByID } from '../../../services/user.services.js'


export const addProduct = asyncWrapper(async(req,res)=>{
    const {name,description,price,userId} = req.body
    const checkFields = validateRequestNote(req)
    if(checkFields){
        return res.status(400).json({message:'All fields are required'})
    }
    const userFound = await findUByID(userId)
    if(!userFound){
        return res.status(404).json({message:'User not found'})
    }
    const newProduct = await createProduct({name,description,price,userId})
    res.status(201).json({message:'Product added successfully', newProduct})
})

export const listProduct = asyncWrapper(async(req,res)=>{
    const products = await findProducts()
    res.status(200).json({message:'All products',products})
})

export const updateProduct = asyncWrapper(async(req,res)=>{
    const {name,description,price} = req.body
    const owner = req.query.owner
    const productId = req.query.productId
    const productFound = await findPById(productId)
    if(!productFound){
        return res.status(404).json({message:'Product not found'})
    }
    const notValidOwner = checkOwner(productFound,owner)
    if(notValidOwner){
        return res.status(400).json({message:'You are not authorized'})
    }
    const updatedProduct = await updateProducts(productId,{name,price,description})
    res.status(200).json({message:'Product updated successfully',updatedProduct})
})

export const deleteProduct = asyncWrapper(async(req,res)=>{
    const owner = req.query.owner
    const productId = req.query.productId
    const productFound = await findPById(productId)
    if(!productFound){
        return res.status(404).json({message:'Product not found'})
    }
    const notOwnerValid = checkOwner(productFound,owner)
    if(notOwnerValid){
        return res.status(400).json({message:'You are not authorized'})
    }
    await deleteOneProduct(productId)
    res.status(200).json({message:'Product deleted successfully'})
})

export const getAllProductsWithOwners = asyncWrapper(async(req,res)=>{
    const products = await productsWithOwners()
    res.status(200).json({message:'Products and their owners information',products})
})

export const sortProducts = asyncWrapper(async(req,res)=>{
    const sortedProducts = await sortByCreatedAt()
    res.status(200).json({message:'Products sorted descending by createdAt field',sortedProducts})
})