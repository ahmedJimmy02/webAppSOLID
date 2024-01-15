import { Router } from "express";
import * as productController from './product.controller.js' 
import authMiddleware from '../../middlewares/auth.middleware.js'
import asyncWrapper from '../../../utils/asyncWrapper.js'
import { multerMiddleware } from "../../middlewares/multer.js";
import allowedExtensions from "../../../utils/allowedExtensions.js";


const router = Router()

router.post('/products',asyncWrapper(authMiddleware()), multerMiddleware({extension:allowedExtensions.image}).array('pp',3) ,productController.addProduct)
router.get('/products', productController.listProduct)
router.put('/products',asyncWrapper(authMiddleware()), multerMiddleware({extension:allowedExtensions.image}).single('image'),productController.updateProduct)
router.delete('/products',asyncWrapper(authMiddleware()), productController.deleteProduct)
router.get('/productsWithOwnerInfo', productController.getAllProductsWithOwners)
router.get('/productsSorted', productController.sortProducts)
router.get('/productLookup', productController.productWithOwnersUsingLookup)
router.get('/numberOfDocuments', productController.retrieveNumberOfDocuments)
router.get('/virtual' , productController.virtualPopulate)
router.post('/likeOrUnlike/:productId' , asyncWrapper(authMiddleware()) , productController.likeOrUnlike)
router.get('/getLikes/:productId' , productController.getAllLikesForProduct)

export default router