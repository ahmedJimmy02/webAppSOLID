import { Router } from "express";
import * as userController from './user.controller.js'

const router = Router()

router.post('/',userController.signUp)
router.post('/login',userController.signIn)
router.put('/',userController.updateUser)
router.delete('/',userController.deleteUser)
router.get('/',userController.searchNameAndAge)
router.get('/searchAgeBetween',userController.searchAgeBetween)
router.get('/listUsers',userController.listUsers)
router.get('/userProducts',userController.userProduct)

export default router