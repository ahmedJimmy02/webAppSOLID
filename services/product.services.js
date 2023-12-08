import Product from "../db/models/product.model.js"

export function validateRequestNote(req){
    const {name,description,price,userId} = req.body
    if(!name||!description||!price||!userId){
        return 'All fields are required'
    }
    return
}

export async function createProduct(productInfo){
    await Product.create(productInfo)
}

export async function findProducts(){
    const products = await Product.find()
    return products
}

export async function findPById(productId){
    const product = await Product.findById(productId)
    return product
}

export async function updateProducts(productId,values){
    const updatedProduct = await Product.updateOne({_id:productId},{$set:values})
    return updatedProduct
}

export function checkOwner(product,owner){
    if(product.userId != owner){
        return 'You are not authorized'
    }
}

export async function deleteOneProduct(productId){
    await Product.deleteOne({_id:productId})
}

export async function productsWithOwners(){
    const products = await Product.find().populate([{path:'userId',select: 'username email age -_id'}])
    return products
}

export async function sortByCreatedAt(){
    const products = await Product.find().sort({createdAt:-1})
    return products
}