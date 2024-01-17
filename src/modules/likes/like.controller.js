import Like from "../../../db/models/like.model.js";
import Product from "../../../db/models/product.model.js";
import Comment from "../../../db/models/comment.model.js";
import Reply from '../../../db/models/reply.model.js'
import asyncWrapper from "../../../utils/asyncWrapper.js";
import * as dbMethods from '../../../db/dbMethods.js'

export const getUserLikesHistory = asyncWrapper(async(req,res)=>{
    const userId = req.payload.id
    const likes = await Like.find({
        likedBy:userId,
        onModel:req.query.onModel
    }).populate([
        { path: 'likeDoneOnId' , populate:{
                path:'addedBy',
                select:'username'
            }
        }
    ])
    res.status(200).json({message:'Done' , likes})
})

export const likeOrUnlike = asyncWrapper(async(req,res,next)=>{
    const {likeDoneOnId} = req.params
    const likedBy = req.payload.id
    const {onModel} = req.body
    let document = ''
    if(onModel === 'Product') {
        document = Product
    }else if(onModel === 'comment') {
        document = Comment
    }else if(onModel === 'Reply') {
        document = Reply
    }
    const documentFound = await dbMethods.findByIDMethod(document,likeDoneOnId)
    if(!documentFound){return next(new Error(`${onModel} not found`, {cause:404}))}
    const isLikedBefore = await Like.findOne({likedBy , likeDoneOnId})
    if(isLikedBefore){
        await Like.findByIdAndDelete(isLikedBefore._id)
        documentFound.numberOfLikes--
        await documentFound.save()
        return res.status(200).json({message:'Un-liked successfully' , documentFound})
    }
    const like = await dbMethods.createMethod(Like , {likedBy , onModel , likeDoneOnId})
    documentFound.numberOfLikes++
    await documentFound.save()
    res.status(200).json({message:'Like done successfully' , data: like , documentFound})
})