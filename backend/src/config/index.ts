import dotenv from 'dotenv';
dotenv.config();

// ============================================
// Shared Types (inline to avoid import issues)
// ============================================
export type Role = 'TRAVELER' | 'OPERATOR' | 'VENDOR' | 'ADMIN';

// ============================================
// Auth Configuration
// ============================================
export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  bcrypt: {
    saltRounds: 12,
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY || 'fallback-key-32-chars-for-dev!!!',
    algorithm: 'aes-256-gcm' as const,
  },
  rbac: {
    TRAVELER: ['profiles:own', 'itineraries:own', 'bookings:own', 'payments:read', 'reviews:write', 'assistant:use'],
    OPERATOR: ['profiles:read', 'itineraries:all', 'bookings:all', 'payments:manage', 'vendors:manage', 'analytics:read', 'operations:manage'],
    VENDOR: ['profiles:own', 'vendors:own', 'bookings:assigned', 'services:own', 'analytics:own'],
    ADMIN: ['*'],
  } as Record<Role, string[]>,
};

// ============================================
// Database Configuration
// ============================================
export const dbConfig = {
  postgres: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'codenova_dev_password',
    database: process.env.DB_NAME || 'codenova_db',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    min: parseInt(process.env.DB_POOL_MIN || '2'),
    max: parseInt(process.env.DB_POOL_MAX || '10'),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'codenova:',
    sessionTtl: parseInt(process.env.REDIS_SESSION_TTL || '604800'),
  },
};

// ============================================
// AI Configuration (OpenRouter)
// ============================================
export const aiConfig = {
  openrouter: {
    apiKey: process.env.ANTHROPIC_AUTH_TOKEN || '',
    baseUrl: process.env.ANTHROPIC_BASE_URL || 'https://openrouter.ai/api',
    model: process.env.ANTHROPIC_MODEL || 'google/gemini-2.0-flash-001',
    temperatures: {
      intentExtraction: 0.1,
      candidateScoring: 0.2,
      draftGeneration: 0.3,
      tradeOffExplainer: 0.4,
      travelAssistantChat: 0.6,
    },
    timeoutMs: parseInt(process.env.AI_TIMEOUT_MS || '30000'),
    maxOutputTokens: parseInt(process.env.AI_MAX_OUTPUT_TOKENS || '2048'),
    rateLimits: {
      maxPerMinute: parseInt(process.env.RATE_LIMIT_AI_MAX || '20'),
    },
  },
};

// ============================================
// Integrations Configuration
// ============================================
export const integrationsConfig = {
  maps: {
    apiKey: process.env.MAPS_API_KEY || '',
    defaultBuffer: 15, // minutes
  },
  weather: {
    apiKey: process.env.WEATHER_API_KEY || '',
    baseUrl: process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5',
  },
  payment: {
    gateway: process.env.PAYMENT_GATEWAY || 'razorpay',
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID || '',
      keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    },
  },
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phone: process.env.TWILIO_PHONE || '',
    whatsapp: process.env.TWILIO_WHATSAPP || '',
  },
};

// ============================================
// Business Rules / Pricing Constants
// ============================================
export const businessConfig = {
  pricing: {
    gstPercentage: parseFloat(process.env.GST_PERCENTAGE || '18'),
    platformFeePercentage: parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || '5'),
    minOperatorMarginPercentage: parseFloat(process.env.MIN_OPERATOR_MARGIN_PERCENTAGE || '10'),
    currency: 'INR',
    currencyPrecision: 2,
  },
  approval: {
    lowImpactScheduleShiftMinutes: 30,
    mediumImpactScheduleShiftMinutes: 60,
    highImpactMarginDropPercentage: 5,
  },
  rateLimiting: {
    globalMax: parseInt(process.env.RATE_LIMIT_GLOBAL_MAX || '200'),
    globalWindowMs: parseInt(process.env.RATE_LIMIT_GLOBAL_WINDOW_MS || '60000'),
    aiMax: parseInt(process.env.RATE_LIMIT_AI_MAX || '20'),
    paymentMax: parseInt(process.env.RATE_LIMIT_PAYMENT_MAX || '5'),
  },
  notifications: {
    retryBase: 1000,
    maxRetries: 3,
  },
};

// ============================================
// Server Configuration
// ============================================
export const serverConfig = {
  port: parseInt(process.env.PORT || '5000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  ml: {
    baseUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
    timeoutMs: parseInt(process.env.ML_SERVICE_TIMEOUT_MS || '8000'),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'pretty',
  },
};
