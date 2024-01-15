import { Schema , model } from "mongoose"

const likeSchema = new Schema(
    {
        likedBy:{type:Schema.Types.ObjectId , ref:'User'},
        likeDoneOnId: {type:Schema.Types.ObjectId , refPath:'onModel'},
        onModel:{type:String , enum:['Product' , 'comment' , 'Reply']}
    },
    {timestamps:true}
)
const Like = model('Like' , likeSchema)
export default Like