var express = require('express');
var router = express.Router();
var Inventory = require('../schemas/inventory');

// Get all inventory records
router.get('/', async function(req, res, next) {
    try {
        const inventories = await Inventory.find().populate('product');
        res.status(200).json(inventories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get inventory by ID
router.get('/:id', async function(req, res, next) {
    try {
        const inventory = await Inventory.findById(req.params.id).populate('product');
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }
        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Stock
router.post('/add-stock', async function(req, res, next) {
    const { product, quantity } = req.body;
    try {
        const inventory = await Inventory.findOne({ product: product });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found for this product' });
        }
        inventory.stock += quantity;
        await inventory.save();
        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove Stock
router.post('/remove-stock', async function(req, res, next) {
    const { product, quantity } = req.body;
    try {
        const inventory = await Inventory.findOne({ product: product });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found for this product' });
        }
        if (inventory.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }
        inventory.stock -= quantity;
        await inventory.save();
        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reservation
router.post('/reservation', async function(req, res, next) {
    const { product, quantity } = req.body;
    try {
        const inventory = await Inventory.findOne({ product: product });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found for this product' });
        }
        if (inventory.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }
        inventory.stock -= quantity;
        inventory.reserved += quantity;
        await inventory.save();
        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Sold
router.post('/sold', async function(req, res, next) {
    const { product, quantity } = req.body;
    try {
        const inventory = await Inventory.findOne({ product: product });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found for this product' });
        }
        if (inventory.reserved < quantity) {
            return res.status(400).json({ message: 'Insufficient reserved stock' });
        }
        inventory.reserved -= quantity;
        inventory.soldCount += quantity;
        await inventory.save();
        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
