import {Router} from 'express'
const router = Router()
import getAllProducts_Controller from '../controllers/getAllProducts_Controller'
import createNewProduct_Controller from '../controllers/createNewProduct_Controller'
import updateProductWithId_Controller from '../controllers/updateProductWithId_Controller'
import getProductWithId_Controller from '../controllers/getProductWithId_Controller'
import deleteProductWithId_Controller from '../controllers/deleteProductWithId_Controller'

// Retrieve a single product by ID
router.get('/',getProductWithId_Controller)


// Retrieve all products
router.get('/all',getAllProducts_Controller)


// Create a new product
router.post('/create',createNewProduct_Controller)   


// Update a product by ID
router.put('/update',updateProductWithId_Controller)


// Delete a product by ID
router.delete('/delete',deleteProductWithId_Controller)

export default router  