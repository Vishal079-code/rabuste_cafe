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
  try {
    const { MenuItem } = getModels();
    const itemData = {
      name: req.body.name,
      groupId: req.body.groupId,
      displayOrder: req.body.displayOrder || 0,
      isActive: req.body.isActive !== false,
      prices: req.body.prices || []
    };
    const item = await MenuItem.create(itemData);
    res.status(201).json(item);
  } catch (err) {
    console.error('Create item error:', err);
    res.status(500).json({ message: 'Failed to create item', error: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { MenuItem } = getModels();
    const updateData = {
      name: req.body.name,
      isActive: req.body.isActive,
      prices: req.body.prices
    };
    if (req.body.displayOrder !== undefined) {
      updateData.displayOrder = req.body.displayOrder;
    }
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    console.error('Update item error:', err);
    res.status(500).json({ message: 'Failed to update item', error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { MenuItem } = getModels();
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Delete item error:', err);
    res.status(500).json({ message: 'Failed to delete item', error: err.message });
  }
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

exports.createGroup = async (req, res) => {
  try {
    const { MenuGroup } = getModels();
    const groupData = {
      name: req.body.name,
      subCategoryId: req.body.subCategoryId,
      displayOrder: req.body.displayOrder || 0,
      isActive: req.body.isActive !== false
    };
    const group = await MenuGroup.create(groupData);
    res.status(201).json(group);
  } catch (err) {
    console.error('Create group error:', err);
    res.status(500).json({ message: 'Failed to create group', error: err.message });
  }
};
