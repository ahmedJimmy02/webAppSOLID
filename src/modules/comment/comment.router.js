import { Router } from "express"
import * as commentController from './comment.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'
import asyncWrapper from '../../../utils/asyncWrapper.js'

const router = Router()

router.post('/:productId' , asyncWrapper(authMiddleware()) , commentController.addComment)
router.post('/likeOrUnlike/:commentId' , asyncWrapper(authMiddleware()) , commentController.likeOrUnlike)

export default router