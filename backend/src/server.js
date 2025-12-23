require('dotenv').config();

// Log MONGO_URI on startup (mask password for security)
const mongoUri = process.env.MONGO_URI;
if (mongoUri) {
  const maskedUri = mongoUri.replace(/:([^:@]+)@/, ':****@');
  console.log('MONGO_URI:', maskedUri);
} else {
  console.error('MONGO_URI is not set in environment');
}

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const coffeeRoutes = require('./routes/coffeeRoutes');
const artRoutes = require('./routes/artRoutes');
const workshopRoutes = require('./routes/workshopRoutes');
const franchiseRoutes = require('./routes/franchiseRoutes');
const insightsRoutes = require('./routes/insightsRoutes');
const aiRoutes = require('./routes/aiRoutes');
const menuImageRoutes = require('./routes/menuImageRoutes');
const imageRoutes = require('./routes/imageRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

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
app.use('/api/menu-images', menuImageRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

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


