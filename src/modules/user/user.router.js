import { Router } from "express";
import * as userController from './user.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'
import asyncWrapper from '../../../utils/asyncWrapper.js'



const router = Router()

router.post('/',userController.signUp)
router.post('/login',userController.signIn) 
router.put('/',asyncWrapper(authMiddleware()),userController.updateUser)
router.delete('/',asyncWrapper(authMiddleware()),userController.deleteUser)
router.get('/',userController.searchNameAndAge)
router.get('/searchAgeBetween',userController.searchAgeBetween)
router.get('/listUsers',userController.listUsers)
router.get('/userProducts',asyncWrapper(authMiddleware()),userController.userProduct)

export default router