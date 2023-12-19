import { Router } from "express";
import * as productController from './product.controller.js' 
import authMiddleware from '../../middlewares/auth.middleware.js'
import asyncWrapper from '../../../utils/asyncWrapper.js'


const router = Router()

router.post('/products',asyncWrapper(authMiddleware()), productController.addProduct)
router.get('/products', productController.listProduct)
router.put('/products',asyncWrapper(authMiddleware()), productController.updateProduct)
router.delete('/products',asyncWrapper(authMiddleware()), productController.deleteProduct)
router.get('/productsWithOwnerInfo', productController.getAllProductsWithOwners)
router.get('/productsSorted', productController.sortProducts)
router.get('/productLookup', productController.productWithOwnersUsingLookup)
router.get('/numberOfDocuments', productController.retrieveNumberOfDocuments)
router.get('/virtual' , productController.virtualPopulate)

export default router