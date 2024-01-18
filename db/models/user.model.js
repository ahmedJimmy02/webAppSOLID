import mongoose from 'mongoose'
import systemRoles from '../../utils/systemRoles.js'

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
        agent:{
            type:String
        },
        IPAddress:{
            type:String
        },
        isConfirmed:{
            type:Boolean,
            default:false
        },
        role:{
            type:String,
            enum:[systemRoles.USER,systemRoles.ADMIN],
            default: systemRoles.USER
        }
    },
    {timestamps:true}
)

// because virtual populate return bSON => binary json
userSchema.set('toObject',{virtuals:true})
userSchema.set('toJSON',{virtuals:true})

userSchema.virtual('virtualUserName').get(function(){
    return `This is my username :  ${this.username}`
})


const User = mongoose.model('User', userSchema) 

export default User