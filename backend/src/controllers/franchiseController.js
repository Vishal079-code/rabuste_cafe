const FranchiseEnquiry = require('../models/FranchiseEnquiry');

const submitEnquiry = async (req, res) => {
  const { name, email, phone, message } = req.body || {};
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    await FranchiseEnquiry.create({ name, email, phone, message });
    res.status(201).json({ message: 'Enquiry submitted. Our team will reach out soon.' });
  } catch (err) {
    res.status(500).json({ message: 'Could not submit enquiry' });
  }
};

module.exports = { submitEnquiry };







