import { Router } from "express";
import * as userController from './user.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'
import asyncWrapper from '../../../utils/asyncWrapper.js'
import validationMiddleware from "../../middlewares/validation.middleware.js";
import * as userValidationSchemas from './user.validationScheams.js'


const router = Router()

router.post('/', validationMiddleware(userValidationSchemas.signUpSchema),userController.signUp)
router.get('/activate_account/:token' ,validationMiddleware(userValidationSchemas.activationSchema) ,userController.activateAccount)
router.post('/login',userController.signIn) 
router.put('/',asyncWrapper(authMiddleware()),userController.updateUser)
router.delete('/',asyncWrapper(authMiddleware()),userController.deleteUser)
router.get('/',userController.searchNameAndAge)
router.get('/searchAgeBetween',userController.searchAgeBetween)
router.get('/listUsers',userController.listUsers)
router.get('/userProducts',asyncWrapper(authMiddleware()),userController.userProduct)

export default router