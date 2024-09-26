import { Router, Request, Response } from 'express';

const router = Router();

let products: { id: number; name: string; category: string; unit: string }[] = [];
let currentId = 1;

// Create a new product
router.post('/product/create', (req: Request, res: Response) => {
    const { name, category, unit } = req.body;
    const newProduct = { id: currentId++, name, category, unit };
    products.push(newProduct);
    res.status(201).json({
        message: "New Product created successfully",
        product: newProduct
    });
});

// Retrieve all products
router.get('/product/all', (req: Request, res: Response) => {
    res.json(products);
});

// Retrieve a single product by ID
router.get('/product', (req: Request, res: Response) => {
    const id = req.query.id;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Product ID is required and must be a string' });
    }

    const product = products.find(p => p.id === parseInt(id));
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
});

// Update a product by ID using query
router.put('/product/update', (req: Request, res: Response) => {
    const id = req.query.id;


    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Product ID is required and must be a string' });
    }

    const productIndex = products.findIndex(p => p.id === parseInt(id));
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const { name, category, unit } = req.body;


    products[productIndex] = { id: parseInt(id), name, category, unit };


    res.json({
        message:"Product updated successfully",
        product: products[productIndex]
    });
});

// Delete a product by ID using query
router.delete('/product/delete', (req: Request, res: Response) => {
    const id = req.query.id;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Product ID is required and must be a string' });
    }

    const productIndex = products.findIndex(p => p.id === parseInt(id));
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    products.splice(productIndex, 1);
    res.status(204).json({
        message:'Product deleted successfully'
    });
});

export default router;
