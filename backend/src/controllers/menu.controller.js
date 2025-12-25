const getModels = () => {
  return {
    MenuCategory: require('../models/MenuCategory')(),
    MenuSubCategory: require('../models/MenuSubCategory')(),
    MenuGroup: require('../models/MenuGroup')(),
    MenuItem: require('../models/MenuItem')(),
  };
};

/* ---------------- PUBLIC ---------------- */

exports.getCategories = async (_req, res) => {
  const { MenuCategory } = getModels();
  const data = await MenuCategory.find({ isActive: true }).sort({ displayOrder: 1 });
  res.json(data);
};

exports.getSubCategories = async (req, res) => {
  const { MenuSubCategory } = getModels();
  const data = await MenuSubCategory.find({
    category: req.params.categoryId,
    isActive: true,
  }).sort({ displayOrder: 1 });
  res.json(data);
};

exports.getItems = async (req, res) => {
  const { MenuGroup, MenuItem } = getModels();

  const groups = await MenuGroup.find({
    subCategory: req.params.subcategoryId,
    isActive: true,
  });

  const items = await MenuItem.find({
    group: { $in: groups.map(g => g._id) },
  }).sort({ displayOrder: 1 });

  res.json(items);
};

/* ---------------- ADMIN ---------------- */

exports.createItem = async (req, res) => {
  const { MenuItem } = getModels();
  const item = await MenuItem.create(req.body);
  res.json(item);
};

exports.updateItem = async (req, res) => {
  const { MenuItem } = getModels();
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
};

exports.deleteItem = async (req, res) => {
  const { MenuItem } = getModels();
  await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item deleted' });
};

exports.updateStock = async (req, res) => {
  const { MenuItem } = getModels();
  const item = await MenuItem.findByIdAndUpdate(
    req.params.id,
    { isInStock: req.body.isInStock },
    { new: true }
  );
  res.json(item);
};

exports.updateDiscount = async (req, res) => {
  const { MenuItem } = getModels();
  const item = await MenuItem.findByIdAndUpdate(
    req.params.id,
    { discountPct: req.body.discountPct },
    { new: true }
  );
  res.json(item);
};

exports.addPrice = async (req, res) => {
  const { MenuItem } = getModels();
  const item = await MenuItem.findById(req.params.id);
  item.prices.push(req.body);
  await item.save();
  res.json(item);
};

exports.removePrice = async (req, res) => {
  const { MenuItem } = getModels();
  const item = await MenuItem.findById(req.params.id);
  item.prices.id(req.params.priceId).remove();
  await item.save();
  res.json(item);
};
