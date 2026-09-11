const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Ensure DB is initialized
require('./config/db');

const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security hardening
app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Enable CORS for frontend clients
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in non-test environments
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/donor', donorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// Root health & welcome
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to e-RaktKosh Connect National Blood Transfusion Service API',
    documentation: '/api/public/health',
    status: 'ONLINE'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found.`
  });
});

// Centralized error handling
app.use(errorHandler);

// Start server only when executed directly (not when required for tests)
let server = null;

if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`e-RaktKosh Connect Backend running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}/api/public/health`);
    console.log(`======================================================\n`);
  });

  const shutdown = () => {
    console.log('\nGracefully terminating e-RaktKosh Backend Server...');
    if (server) {
      server.close(() => {
        console.log('HTTP connections closed cleanly.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

module.exports = { app, server };
