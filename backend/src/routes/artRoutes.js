const express = require('express');
const { getArt } = require('../controllers/artController');

const router = express.Router();

router.get('/', getArt);

module.exports = router;




