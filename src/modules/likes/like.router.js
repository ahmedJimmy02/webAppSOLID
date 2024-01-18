import { Router } from "express"
import * as likeController from './like.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'
import asyncWrapper from '../../../utils/asyncWrapper.js'
import endPointsRoles from "../product/product.endPoints.Roles.js"

const router = Router()

router.get('/' , asyncWrapper(authMiddleware()) , likeController.getUserLikesHistory)
router.post ('/likeOrUnLike/:likeDoneOnId' , asyncWrapper(authMiddleware(endPointsRoles.ADD_PRODUCT)) , likeController.likeOrUnlike)

export default router