import {Schema , model} from 'mongoose'

const replySchema = new Schema ({
    content: {type:String , required:true},
    addedBy: {type:Schema.Types.ObjectId , ref:'User'},
    numberOfLikes: {type:Number , default:0 , min:0},
    replyOnId: {type:Schema.Types.ObjectId , refPath:'onModel'},
    onModel: {type:String , enum:['comment' , 'Reply']}
},{timestamps:true})

const Reply = model('Reply' , replySchema)
export default Reply