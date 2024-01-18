import Joi from "joi";
import { generalRules } from "../../../utils/generalValidationRules.js";


export const likeProductSchema = {
    params: Joi.object({
        productId: generalRules.dbId.required()
    })
}