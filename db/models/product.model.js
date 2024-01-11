import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        images:[{
            public_id:{type:String , required:true , unique: true},
            secure_url:{type:String , required: true},
            folderId:{type:String , required: true}
        }],
        numberOfLikes: {type:Number , default: 0 , min:0}
    },
    {timestamps:true}
)


const Product = mongoose.model('Product' , productSchema)
export default Product