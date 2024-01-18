import {Types} from 'mongoose'
import Joi from 'joi'

const objectIdValidation = (value , helper)=>{
    const isValid = Types.ObjectId.isValid(value)
    return (isValid ? value : helper.message('ObjectId format is not valid'))
}

export const generalRules = {
    dbId:Joi.string().custom(objectIdValidation)
}