# Deployment Guide - Vaultiva Backend

## Prerequisites

- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Docker (optional)

## Environment Setup

1. **Clone and Install**
```bash
git clone <repository-url>
cd vaultiva-backend
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database Setup**
```bash
# Create database
createdb vaultiva_db

# Run migrations
npm run migration:run

# Seed initial data
npm run seed
```

4. **Redis Setup**
```bash
# Install Redis (Ubuntu/Debian)
sudo apt update
sudo apt install redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

## Development

```bash
# Start development server
npm run start:dev

# Run tests
npm run test
npm run test:e2e

# Generate migration
npm run migration:generate -- src/database/migrations/YourMigrationName
```

## Production Deployment

### Docker Deployment

1. **Build Docker Image**
```bash
docker build -t vaultiva-backend .
```

2. **Run with Docker Compose**
```bash
docker-compose up -d
```

### Manual Deployment

1. **Build Application**
```bash
npm run build
```

2. **Set Production Environment**
```bash
export NODE_ENV=production
export DB_HOST=your-production-db-host
export DB_PASSWORD=your-production-db-password
# ... other environment variables
```

3. **Run Migrations**
```bash
npm run migration:run
```

4. **Start Application**
```bash
npm run start:prod
```

### PM2 Deployment

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start dist/main.js --name vaultiva-backend

# Save PM2 configuration
pm2 save
pm2 startup
```

## Health Checks

- **Application**: `GET /health`
- **Database**: `GET /health/database`
- **Redis**: `GET /health/redis`

## Monitoring

- **Logs**: Check `logs/` directory
- **Metrics**: Available at `/metrics` (if enabled)
- **API Docs**: Available at `/docs`

## Security Checklist

- [ ] SSL/TLS certificates configured
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Webhook endpoints secured
- [ ] Backup strategy implemented

## Scaling Considerations

- Use Redis Cluster for high availability
- Implement database read replicas
- Use load balancer for multiple instances
- Monitor memory and CPU usage
- Implement proper logging and alerting