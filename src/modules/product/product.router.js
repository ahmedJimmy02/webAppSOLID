import { Router } from "express";
import * as productController from './product.controller.js' 
import isAuthenticated from "../../middlewares/isAuthenticated.js";

const router = Router()

router.post('/products',isAuthenticated, productController.addProduct)
router.get('/products', productController.listProduct)
router.put('/products',isAuthenticated, productController.updateProduct)
router.delete('/products',isAuthenticated, productController.deleteProduct)
router.get('/productsWithOwnerInfo', productController.getAllProductsWithOwners)
router.get('/productsSorted', productController.sortProducts)
router.get('/productLookup', productController.productWithOwnersUsingLookup)
router.get('/numberOfDocuments', productController.retrieveNumberOfDocuments)
router.get('/virtual' , productController.virtualPopulate)

export default router