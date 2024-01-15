import { Router } from "express"
import * as likeController from './like.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'
import asyncWrapper from '../../../utils/asyncWrapper.js'

const router = Router()

router.get('/' , asyncWrapper(authMiddleware()) , likeController.getUserLikesHistory)

export default router