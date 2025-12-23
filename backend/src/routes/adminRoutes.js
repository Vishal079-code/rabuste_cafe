const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const MenuImage = require('../models/MenuImage');
const Workshop = require('../models/Workshop');
const Art = require('../models/Art');

const router = express.Router();

// All admin routes require authenticated admin
router.use(authMiddleware, adminMiddleware);

// POST /api/admin/menu - add menu image
router.post('/menu', async (req, res) => {
  try {
    const { category, url, public_id } = req.body || {};
    if (!category || !url || !public_id) {
      return res.status(400).json({ message: 'category, url, and public_id are required' });
    }
    const created = await MenuImage.create({ category, url, public_id });
    res.status(201).json(created);
  } catch (err) {
    console.error('Admin create menu image error:', err);
    res.status(500).json({ message: 'Failed to create menu image' });
  }
});

// POST /api/admin/workshops - add workshop
router.post('/workshops', async (req, res) => {
  try {
    const { title, description, date, totalSeats, tags } = req.body || {};
    if (!title || !description || !date || !totalSeats) {
      return res
        .status(400)
        .json({ message: 'title, description, date, and totalSeats are required' });
    }
    const created = await Workshop.create({
      title,
      description,
      date,
      totalSeats,
      tags: tags || [],
    });
    res.status(201).json(created);
  } catch (err) {
    console.error('Admin create workshop error:', err);
    res.status(500).json({ message: 'Failed to create workshop' });
  }
});

// POST /api/admin/art - add art listing
router.post('/art', async (req, res) => {
  try {
    const { title, artistName, description, price, imageUrl, availability, moodTags } =
      req.body || {};
    if (!title || !artistName || !description || !price || !imageUrl) {
      return res
        .status(400)
        .json({ message: 'title, artistName, description, price, and imageUrl are required' });
    }
    const created = await Art.create({
      title,
      artistName,
      description,
      price,
      imageUrl,
      availability: availability || 'available',
      moodTags: moodTags || [],
    });
    res.status(201).json(created);
  } catch (err) {
    console.error('Admin create art error:', err);
    res.status(500).json({ message: 'Failed to create art listing' });
  }
});

module.exports = router;


