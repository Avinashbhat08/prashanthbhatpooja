import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  jwtSecret: process.env.JWT_SECRET || 'pooja-sacred-jwt-secret-key-bangalore-2026',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
};

