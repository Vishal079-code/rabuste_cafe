const Workshop = require('../models/Workshop');

const getWorkshops = async (_req, res) => {
  try {
    const workshops = await Workshop.find().sort({ date: 1 });
    res.json(
      workshops.map((w) => ({
        ...w.toObject(),
        seatsLeft: Math.max(w.totalSeats - w.registeredCount, 0),
      }))
    );
  } catch (err) {
    res.status(500).json({ message: 'Failed to load workshops' });
  }
};

const registerWorkshop = async (req, res) => {
  const { workshopId, name, email } = req.body || {};
  if (!workshopId || !name || !email) {
    return res.status(400).json({ message: 'workshopId, name, and email are required' });
  }
  try {
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });

    const seatsLeft = workshop.totalSeats - workshop.registeredCount;
    if (seatsLeft <= 0) {
      return res.status(400).json({ message: 'No seats left' });
    }

    workshop.registeredCount += 1;
    await workshop.save();
    res.json({
      message: 'Registration confirmed',
      seatsLeft: workshop.totalSeats - workshop.registeredCount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
};

module.exports = { getWorkshops, registerWorkshop };

