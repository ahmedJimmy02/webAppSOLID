import { Router } from "express"
import * as replyController from './reply.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'
import asyncWrapper from '../../../utils/asyncWrapper.js'

const router = Router()

router.post('/:replyOnId' , asyncWrapper(authMiddleware()) , replyController.addReply)

export default router