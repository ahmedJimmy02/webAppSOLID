import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        age:{
            type:Number,
            required:true
        },
        phone:{
            type:Number,
            required:true
        },
        gender:{
            type:String,
            enum:['Male' , 'Female'],
            default:'Male'
        },
    },
    {timestamps:true}
)

userSchema.set('toObject',{virtuals:true})
userSchema.set('toJSON',{virtuals:true})

userSchema.virtual('virtualUserName', {
    ref:'Product',
    localField:'_id',
    foreignField:'userId'
}).get(function(){
    return `This is my username :  ${this.username}`
})


const User = mongoose.model('User', userSchema) 

export default User