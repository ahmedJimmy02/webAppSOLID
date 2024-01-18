import asyncWrapper from '../../../utils/asyncWrapper.js'
import * as dbMethods from '../../../db/dbMethods.js'
import Product from '../../../db/models/product.model.js'
import Like from '../../../db/models/like.model.js'
import cloudinaryConnection from '../../../utils/cloudinary.js'
import generateUniqueString from '../../../utils/generateUniqueString.js'
import Comment from '../../../db/models/comment.model.js'
import axios from 'axios'

export const addProduct = asyncWrapper(async(req,res,next)=>{
    const {name,description,price} = req.body
    const userId = req.payload.id
    if(!req.files?.length){
        return next(new Error('Please upload at least one image' , {cause:400}))
    }
    let images = []
    let publicIdsArr = []
    const folderId = generateUniqueString()
    for (const file of req.files) {
        const {secure_url,public_id} = await cloudinaryConnection().uploader.upload(file.path,{
            folder: `upVoteImages/products/${userId}/${folderId}`
        })
        images.push({secure_url,public_id,folderId})
        publicIdsArr.push(public_id)
    }
    const newProduct = await dbMethods.createMethod(Product,{name,description,price,userId , images})
    if(!newProduct){
        const data = await cloudinaryConnection().api.delete_resources(publicIdsArr)
        console.log(data)
        return next(new Error('Created Failed' , {cause:400}))
    }
    res.status(201).json({message:'Product added successfully', newProduct})
}) 

export const listProduct = asyncWrapper(async(req,res)=>{
    const products = await dbMethods.findAllMethod(Product)
    res.status(200).json({message:'All products',products})
})

export const updateProduct = asyncWrapper(async(req,res,next)=>{
    const {name,description,price,oldPublicId}  = req.body
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
    if(name) productFound.name = name
    if(description) productFound.description = description
    if(price) productFound.price = price
    if(oldPublicId){
        if(!req.file) return next(new Error('Please upload new image',{cause:400}))
        await cloudinaryConnection().uploader.destroy(oldPublicId)
        const {secure_url , public_id} = await cloudinaryConnection().uploader.upload(req.file.path,{
            folder:`upVoteImages/products/${owner}/${productFound.images[0].folderId}`
        })
        productFound.images.map(image=>{
            if(image.public_id === oldPublicId){
                image.public_id = public_id
                image.secure_url = secure_url
            }
        })
    }
    await productFound.save()
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
        return next(new Error('Deleted failed' , {cause:400}))
    }
    let publicIdArr = []
    for (const image of productFound.images) {
        publicIdArr.push(image.public_id)
    }
    let folderIdArr = []
    const folderPath = `upVoteImages/products/${owner}/${productFound.images[0].folderId}`
    folderIdArr.push(folderPath)
    await cloudinaryConnection().api.delete_resources(publicIdArr)
    const deleteFolder = await cloudinaryConnection().api.delete_folder(folderIdArr)
    console.log(deleteFolder)
    res.status(200).json({message:'Product deleted successfully'})
})

export const getAllProductsWithOwners = asyncWrapper(async(req,res)=>{
    const products = await dbMethods.getProductsWithOwnerInfo(Product , 'userId')
    res.status(200).json({message:'Products and their owners information',products})
})

export const sortProducts = asyncWrapper(async(req,res)=>{
    const products = Product.find().cursor()
    let finalResult = []
    for(let doc = await products.next(); doc!=null ; doc = await products.next()){
        const comments = await Comment.find({productId:doc._id})
        const docObject = doc.toObject()
        docObject.comments = comments
        finalResult.push(docObject)
    }
    res.status(200).json({message:'Products sorted descending by createdAt field',finalResult})
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
    res.status(200).json({message:'virtual populate' ,owner:data.userId.virtualUserName})
})

/*get all likes*/
export const getAllLikesForProduct = asyncWrapper(async(req,res)=>{
    const {productId} = req.params
    const allLikes = await Like.find({likeDoneOnId: productId}).populate([{path:'likeDoneOnId'}])
    res.status(200).json({message:'success' , allLikes})
})

export const usingAxios = asyncWrapper(async(req,res)=>{
    /**
     * step 1
     * step 2
     */
    const {productId} = req.params
    const {onModel} = req.body
    const {token} = req.headers
    axios({
        method:'post',
        url:`http://localhost:3000/like/likeOrUnLike/${productId}`,
        data:{
            onModel
        },
        headers:{
            token
        }
    }).then((resp)=> {
        console.log(resp.data)
        res.status(200).json({response:resp.data})
    })
    .catch((err)=> {
        console.log(err.data)
        res.status(500).json({catch:err.data})
    })
})