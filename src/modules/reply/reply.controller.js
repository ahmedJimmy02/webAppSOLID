import asyncWrapper from '../../../utils/asyncWrapper.js'
import Product from '../../../db/models/product.model.js'
import Comment from '../../../db/models/comment.model.js'
import Like from '../../../db/models/like.model.js'
import * as dbMethods from '../../../db/dbMethods.js'
import Reply from '../../../db/models/reply.model.js'

export const addReply = asyncWrapper(async(req,res)=>{
    const {onModel,content} = req.body
    const addedBy = req.payload.id
    const {replyOnId} = req.params

    if(onModel == 'comment'){
        const comment = await Comment.findById(replyOnId)
        if(!comment) return next(new Error('comment not found',{cause:404}))
    }else if(onModel == 'Reply'){
        const reply = await Reply.findById(replyOnId)
        if(!reply) return next(new Error('reply not found',{cause:404}))
    }

    const reply = await Reply.create({content,addedBy , onModel , replyOnId })
    res.status(200).json({message:'Reply created done' , reply})
})