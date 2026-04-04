const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const cron = require('node-cron');
const triggerService = require('./services/trigger.service');

// Routes
const userRoutes = require('./routes/user.routes');
const policyRoutes = require('./routes/policy.routes');
const claimRoutes = require('./routes/claim.routes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/claims', claimRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ZomatoShield API is running' });
});

// Error handler
app.use(errorHandler);

// Automated trigger system - Check weather every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  console.log('Running automated weather check...');
  try {
    await triggerService.checkAllActivePolicies();
  } catch (error) {
    console.error('Automated trigger error:', error.message);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ ZomatoShield Backend running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});