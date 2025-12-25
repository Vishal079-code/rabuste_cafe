const router = require('express').Router();
const ctrl = require('../controllers/menu.controller');

router.post('/item', ctrl.createItem);
router.put('/item/:id', ctrl.updateItem);
router.delete('/item/:id', ctrl.deleteItem);

router.patch('/item/:id/stock', ctrl.updateStock);
router.patch('/item/:id/discount', ctrl.updateDiscount);

router.post('/item/:id/price', ctrl.addPrice);
router.delete('/item/:id/price/:priceId', ctrl.removePrice);

module.exports = router;
