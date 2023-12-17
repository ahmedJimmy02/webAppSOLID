import { Router } from "express";
import * as userController from './user.controller.js'
import isAuthenticated from '../../middlewares/isAuthenticated.js'

const router = Router()

router.post('/',userController.signUp)
router.post('/login',userController.signIn)
router.put('/',isAuthenticated,userController.updateUser)
router.delete('/',isAuthenticated,userController.deleteUser)
router.get('/',userController.searchNameAndAge)
router.get('/searchAgeBetween',userController.searchAgeBetween)
router.get('/listUsers',userController.listUsers)
router.get('/userProducts',isAuthenticated,userController.userProduct)

export default router