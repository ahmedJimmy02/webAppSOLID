export async function findOneMethod(modelType,field,value){
    const data = await modelType.findOne({[field]: value})
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

export function checkPasswordMethod(Product, password){
    if(product.password !== password){
        return 'You are not authorized'
    }
    return
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
        return 'You are not authorized'
    }
    return
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
            // $group:{
                // this is classification in name,price and description this result will be all documents in db if no duplicates documents
            //     _id: {name:"$name" , price:"$price" , description:"$description"},
            // },
            // $group:{
            //     _id:null,
            //     count: { $sum: 1}
            // }
            // $group:{
                // ignore duplicates exactly but he was make classification on the field you want
            //     _id: '$description'
            // }
            // ***pipeline concept***
            // filter all products with description = this is amazing product
            $match:{description:"this is amazing product"}
        },
        // group products and retrieve name and calculate total price of this name 
        {
            $group:{_id:"$name" , totalPrice: {$sum:"$price"}}
        }
    ])
    return result
}