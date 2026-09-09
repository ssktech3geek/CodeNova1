# Configuration - Instructions

## Purpose
Centralized configuration management for all backend services with environment-specific overrides.

## Configuration Structure

### 1. Application Config
```yaml
app:
  name: "codenova-backend"
  version: "1.0.0"
  env: "development|staging|production"
  port: 3000
  apiPrefix: "/api/v1"
  corsOrigins: ["https://app.codenova.com"]
  rateLimit:
    windowMs: 900000
    maxRequests: 100
```

### 2. Database Config
```yaml
database:
  primary:
    host: "localhost"
    port: 5432
    name: "codenova"
    user: "app_user"
    password: "${DB_PASSWORD}"
    pool:
      min: 2
      max: 20
      idleTimeout: 30000
  readReplica:
    host: "localhost"
    port: 5433
    # ... same as primary
```

### 3. Cache Config
```yaml
cache:
  redis:
    host: "localhost"
    port: 6379
    password: "${REDIS_PASSWORD}"
    db: 0
    connectionTimeout: 5000
    defaultTTL: 300
  local:
    enabled: true
    maxSize: 1000
    ttl: 60
```

### 4. Search Config
```yaml
search:
  elasticsearch:
    node: "http://localhost:9200"
    username: "elastic"
    password: "${ES_PASSWORD}"
    indexPrefix: "codenova"
```

### 5. Event Store Config
```yaml
eventStore:
  type: "postgres|eventstore|kafka"
  connection: "..."
  streamPrefix: "codenova"
```

### 6. External Services
```yaml
external:
  maps:
    provider: "google|mapbox|osm"
    apiKey: "${MAPS_API_KEY}"
    rateLimit: 1000
  weather:
    provider: "openweathermap|weatherapi"
    apiKey: "${WEATHER_API_KEY}"
  payments:
    razorpay:
      keyId: "${RAZORPAY_KEY_ID}"
      keySecret: "${RAZORPAY_KEY_SECRET}"
      webhookSecret: "${RAZORPAY_WEBHOOK_SECRET}"
    stripe:
      secretKey: "${STRIPE_SECRET_KEY}"
      webhookSecret: "${STRIPE_WEBHOOK_SECRET}"
  notifications:
    email:
      provider: "sendgrid|ses|mailgun"
      apiKey: "${EMAIL_API_KEY}"
      fromAddress: "noreply@codenova.com"
    sms:
      provider: "twilio|plivo"
      accountSid: "${SMS_ACCOUNT_SID}"
      authToken: "${SMS_AUTH_TOKEN}"
    whatsapp:
      provider: "twilio|gupshup"
      apiKey: "${WHATSAPP_API_KEY}"
    push:
      provider: "firebase|onesignal"
      apiKey: "${PUSH_API_KEY}"
```

### 7. AI/ML Config
```yaml
ai:
  llm:
    provider: "anthropic|openai|local"
    model: "claude-3-sonnet"
    apiKey: "${LLM_API_KEY}"
    maxTokens: 4096
    temperature: 0.3
  embeddings:
    provider: "openai|huggingface|local"
    model: "text-embedding-3-small"
    dimensions: 1536
```

### 8. Feature Flags
```yaml
features:
  dynamicReplanning: true
  offlineMode: true
  multiLanguage: true
  advancedAnalytics: false
  vendorPortal: true
```

## Configuration Loading
1. Base config from `config/default.yaml`
2. Environment override from `config/{env}.yaml`
3. Local override from `config/local.yaml` (gitignored)
4. Environment variables (highest priority)
5. Secrets from secret manager (Vault, AWS Secrets Manager)

## Key Constraints
- No secrets in config files - use environment variables
- Validate config on startup
- Type-safe config access (TypeScript interfaces)
- Hot reload for non-sensitive config in development
- Audit config changes in production