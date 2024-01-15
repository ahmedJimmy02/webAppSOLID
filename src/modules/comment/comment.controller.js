import asyncWrapper from '../../../utils/asyncWrapper.js'
import Product from '../../../db/models/product.model.js'
import Comment from '../../../db/models/comment.model.js'
import Like from '../../../db/models/like.model.js'
import * as dbMethods from '../../../db/dbMethods.js'

export const addComment = asyncWrapper(async(req,res,next)=>{
    const {content} = req.body
    const addedBy = req.payload.id
    const {productId} = req.params
    const product = await Product.findById(productId)
    if(!product) return next(new Error('product not found',{cause:404}))
    const comment = await Comment.create({content , addedBy , productId})
    if(!comment) return next(new Error('Comment creation failed',{cause:400}))
    res.status(201).json({message:'Comment added successfully' , comment})
})

export const likeOrUnlike = asyncWrapper(async(req,res,next)=>{
    const {commentId} = req.params
    const likedBy = req.payload.id
    const {onModel} = req.body
    const commentFound = await dbMethods.findByIDMethod(Comment,commentId)
    if(!commentFound){return next(new Error('Comment not found', {cause:404}))}
    const isLikedBefore = await Like.findOne({likedBy , likeDoneOnId:commentId})
    if(isLikedBefore){
        await Like.findByIdAndDelete(isLikedBefore._id)
        commentFound.numberOfLikes--
        await commentFound.save()
        return res.status(200).json({message:'Un-liked successfully' , count:commentFound.numberOfLikes})
    }
    const like = await dbMethods.createMethod(Like , {likedBy , onModel , likeDoneOnId:commentId})
    commentFound.numberOfLikes++
    await commentFound.save()
    res.status(200).json({message:'Like done successfully' , data: like , count:commentFound.numberOfLikes})
})