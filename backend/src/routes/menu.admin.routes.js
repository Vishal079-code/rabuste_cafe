const router = require('express').Router();
const ctrl = require('../controllers/menu.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// All admin menu routes require authenticated admin
router.use(authMiddleware, adminMiddleware);

router.post('/item', ctrl.createItem);
router.put('/item/:id', ctrl.updateItem);
router.delete('/item/:id', ctrl.deleteItem);

router.patch('/item/:id/stock', ctrl.updateStock);
router.patch('/item/:id/discount', ctrl.updateDiscount);

router.post('/item/:id/price', ctrl.addPrice);
router.delete('/item/:id/price/:priceId', ctrl.removePrice);

router.post('/group', ctrl.createGroup);

module.exports = router;
