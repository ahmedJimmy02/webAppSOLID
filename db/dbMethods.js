import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function findOneMethod(modelType,field){
    const data = await modelType.findOne(field)
    return data
}

export async function createMethod(modelType , data){
    const createdDocument = await modelType.create(data)
    return createdDocument
}

export async function findByIDMethod(modelType,_id){
    const data = await modelType.findById(_id) 
    return data
}

export async function updateOneMethod(modelType, _id , values){
    const updateFields = await modelType.updateOne({_id} , {$set:values})
    return updateFields
}

export async function deleteOneMethod(modelType, _id){
    const deletedUser = await modelType.deleteOne({_id})
    return deletedUser
}

export async function findAllMethod(modelType){
    const data = await modelType.find()
    return data
}

export async function searchWithNameAndAgeMethod(modelType,wordQuery , ageQuery){
    const data = await modelType.find({
        username:{
            $regex: new RegExp(wordQuery)
        },
        age:{
            $lt:ageQuery
        }
    })
    return data
}

export async function searchWithArrayOfAges(modelType, ageQuery){
    const data = await modelType.find({
        age:{
            $gt:ageQuery[0],
            $lt:ageQuery[1]
        }
    })
    return data
}

export async function searchUserProducts(modelType,userId){
    const data = await modelType.find({userId})
    return data
}

export function checkIsThisOwnerOrNot(product , owner){
    if(product.userId != owner){
        return {message:'You are not authorized' , success:false}
    }
    return {message:'You are not authorized' , success:true}
}

export async function getProductsWithOwnerInfo(modelType,refId){
    const data = await modelType.find().populate(`${refId}` , 'username email -_id')
    return data
}

export async function getProductsWithOwnerInfoUsingLookUp(modelType,fromModel,localField,foreignField,as){
    const data = await modelType.aggregate([
        {$lookup:{
            from:`${fromModel}`,
            localField:`${localField}`,
            foreignField:`${foreignField}`,
            as:`${as}`
        }}
    ])
    return data
}

export async function getSortedDescendingByCreatedAt(modelType){
    const data = await modelType.find().sort({createdAt:-1})
    return data
}

export async function getNumberOfDocument(modelType){
    const result = await modelType.aggregate([
        {
            $match:{description:"this is amazing product"}
        },
        
        {
            $group:{_id:"$name" , totalPrice: {$sum:"$price"}}
        }
    ])
    return result
}

export function hashedPasswordMethod(password){
    const passwordHash = bcrypt.hashSync(password , +process.env.SAULT_ROUNDS)
    return passwordHash
}

export function comparePassword(password , comparePassword){
    const check = bcrypt.compareSync(password, comparePassword)
    return check
}

export function generateToken(data){
    const token = jwt.sign(data , process.env.SECRET_KEY , {expiresIn:'2d'})
    return token
}

export function verifyToken(token){
    const payload = jwt.verify(token,  process.env.SECRET_KEY)
    return payload
}