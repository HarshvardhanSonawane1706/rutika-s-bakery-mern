import express from 'express';
import Product from '../models/Product.js';
import { seedProducts } from '../seedData.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        let filter = { available: true };
        
        if (category && category !== 'all') {
            filter.category = category;
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create product (Admin only)
router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Debug: Reseed products (temporary endpoint)
router.post('/debug/reseed', async (req, res) => {
    try {
        await Product.deleteMany({});
        console.log('Cleared all products');
        await seedProducts();
        const products = await Product.find();
        res.json({ message: 'Products reseeded', count: products.length, products });
    } catch (error) {
        res.status(500).json({ message: 'Error reseeding', error: error.message });
    }
});

export default router;