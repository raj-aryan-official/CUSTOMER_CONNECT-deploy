const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const auth = require('../middleware/auth');

// Search products
router.get('/products', async (req, res) => {
  try {
    const {
      query,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 10
    } = req.query;

    const searchQuery = {};

    // Text search
    if (query) {
      searchQuery.$text = { $search: query };
    }

    // Category filter
    if (category) {
      searchQuery.category = category;
    }

    // Price range
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
    }

    // Stock filter
    if (inStock === 'true') {
      searchQuery.stock = { $gt: 0 };
    }

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(searchQuery)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('shopOwner', 'name');

    const total = await Product.countDocuments(searchQuery);

    res.json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching products' });
  }
});

// Search shops
router.get('/shops', async (req, res) => {
  try {
    const {
      query,
      category,
      city,
      isOpen,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 10
    } = req.query;

    const searchQuery = { isActive: true };

    // Text search
    if (query) {
      searchQuery.$text = { $search: query };
    }

    // Category filter
    if (category) {
      searchQuery.categories = category;
    }

    // City filter
    if (city) {
      searchQuery['address.city'] = city;
    }

    // Open now filter
    if (isOpen === 'true') {
      const now = new Date();
      const day = now.toLocaleLowerCase();
      const time = now.toLocaleTimeString('en-US', { hour12: false });
      
      searchQuery['businessHours'] = {
        $elemMatch: {
          day,
          isClosed: false,
          open: { $lte: time },
          close: { $gte: time }
        }
      };
    }

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const shops = await Shop.find(searchQuery)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('owner', 'name');

    const total = await Shop.countDocuments(searchQuery);

    res.json({
      shops,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching shops' });
  }
});

// Get search suggestions
router.get('/suggestions', auth, async (req, res) => {
  try {
    const { query, type = 'all' } = req.query;
    const suggestions = [];

    if (type === 'all' || type === 'products') {
      const productSuggestions = await Product.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(5)
        .select('name category');

      suggestions.push(...productSuggestions.map(p => ({
        type: 'product',
        text: p.name,
        category: p.category
      })));
    }

    if (type === 'all' || type === 'shops') {
      const shopSuggestions = await Shop.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(5)
        .select('name categories');

      suggestions.push(...shopSuggestions.map(s => ({
        type: 'shop',
        text: s.name,
        categories: s.categories
      })));
    }

    // Add to user's recent searches
    if (req.user.role === 'customer') {
      await req.user.addRecentSearch(query);
    }

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Error getting suggestions' });
  }
});

module.exports = router; 