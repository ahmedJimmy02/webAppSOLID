import Like from "../../../db/models/like.model.js";
import asyncWrapper from "../../../utils/asyncWrapper.js";

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