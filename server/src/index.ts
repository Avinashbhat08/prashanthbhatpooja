import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import authRoutes from './routes/auth.js';
import poojaItemRoutes from './routes/poojaItems.js';
import categoryRoutes from './routes/categories.js';
import galleryRoutes from './routes/gallery.js';
import poojaRequestRoutes from './routes/poojaRequests.js';
import settingRoutes from './routes/settings.js';
import horoscopeRequestRoutes from './routes/horoscopeRequests.js';
import notificationRoutes from './routes/notifications.js';
import panchangaRoutes from './routes/panchanga.js';
import muhurtaRoutes from './routes/muhurta.js';
import marriageMatchingRoutes from './routes/marriageMatching.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Allowed Origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'https://prashanthbhatpooja.vercel.app',
  'https://prashanthbhatpooja-g78j.vercel.app',
];

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive fallback to prevent breaking new vercel preview URLs
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
const uploadDir = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pooja-items', poojaItemRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/pooja-requests', poojaRequestRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/horoscope-requests', horoscopeRequestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/panchanga', panchangaRoutes);
app.use('/api/muhurta', muhurtaRoutes);
app.use('/api/marriage-matching', marriageMatchingRoutes);

// Health check endpoint (matches Step 10 specification)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Pooja API is running',
    environment: process.env.NODE_ENV || 'production',
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(config.port, () => {
    console.log(`Pooja Services Server running on http://localhost:${config.port}`);
  });
}

export { app };
export default app;

