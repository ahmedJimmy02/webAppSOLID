import joi from 'joi'

const ageRule = (value, helper)=>{
    if(value == 5){
        return helper.message('Age must be greater than 5')
    }
    return value
}
export const signUpSchema ={
    body: joi.object({
        username: joi.string().min(4).max(11).alphanum().required(),
        email: joi.string().email({tlds:{allow:['com','yahoo','org']} , minDomainSegments:2}).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        age: joi.number().required().integer().custom(ageRule),
        gender: joi.string().valid('Male','Female'),
        phone:joi.number().required(),
        repass: joi.string().valid(joi.ref('password'))
    })
    .with('password' , 'repass')
}

export const activationSchema = {
    params:joi.object({
        token:joi.string().required()
    })
}