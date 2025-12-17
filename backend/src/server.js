require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const coffeeRoutes = require('./routes/coffeeRoutes');
const artRoutes = require('./routes/artRoutes');
const workshopRoutes = require('./routes/workshopRoutes');
const franchiseRoutes = require('./routes/franchiseRoutes');
const insightsRoutes = require('./routes/insightsRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.send('Rabuste Coffee API is alive'));
app.use('/api/coffee', coffeeRoutes);
app.use('/api/art', artRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/franchise', franchiseRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/ai', aiRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected error' });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Rabuste Coffee backend running on port ${PORT}`);
  });
});

