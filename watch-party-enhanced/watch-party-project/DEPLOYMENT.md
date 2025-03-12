# Watch Party Deployment Documentation

## Overview

This document provides comprehensive instructions for deploying the Watch Party application with all its enhanced features, including the support system with email feedback functionality and cryptocurrency payment system for subscriptions.

## System Requirements

- Node.js 16.x or higher
- Redis 6.x or higher
- MongoDB 4.x or higher (optional, for persistent storage)
- SMTP server for email functionality
- SSL certificate for production deployment

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Redis
REDIS_URL=redis://localhost:6379

# Email Configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
SMTP_FROM_EMAIL=support@your-domain.com
SMTP_FROM_NAME=Watch Party Support

# Payment Providers
CRYPTAPI_API_KEY=your-cryptapi-api-key
COINGATE_API_KEY=your-coingate-api-key
COINGATE_ENVIRONMENT=live # or sandbox for testing
```

## Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/watch-party.git
   cd watch-party
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Start the application:
   ```bash
   npm start
   ```

## Redis Setup

Redis is required for room functionality and synchronization:

1. Install Redis:
   ```bash
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install redis-server
   
   # CentOS/RHEL
   sudo yum install redis
   
   # macOS
   brew install redis
   ```

2. Start Redis:
   ```bash
   sudo systemctl start redis-server  # Linux
   brew services start redis          # macOS
   ```

3. Verify Redis is running:
   ```bash
   redis-cli ping
   ```
   Should return `PONG`.

## Email Configuration

The support system requires a properly configured SMTP server:

1. Set up an SMTP server or use a service like SendGrid, Mailgun, or Amazon SES.
2. Update the SMTP environment variables in your `.env` file.
3. Test the email functionality by submitting a support request.

## Payment Provider Setup

### CryptAPI Setup

1. Visit [CryptAPI](https://cryptapi.io/) and create an account.
2. Generate an API key from your dashboard.
3. Add the API key to your `.env` file as `CRYPTAPI_API_KEY`.
4. Whitelist your server IPs in the CryptAPI dashboard for callback security.

### CoinGate Setup

1. Visit [CoinGate](https://coingate.com/) and create a merchant account.
2. Generate an API key from your dashboard.
3. Add the API key to your `.env` file as `COINGATE_API_KEY`.
4. Set the environment to `sandbox` for testing or `live` for production.

## Deployment Options

### Option 1: Traditional Server Deployment

1. Set up a server with Node.js and Redis installed.
2. Clone the repository and follow the installation steps.
3. Use a process manager like PM2 to keep the application running:
   ```bash
   npm install -g pm2
   pm2 start npm --name "watch-party" -- start
   ```
4. Set up a reverse proxy with Nginx or Apache to handle HTTPS.

### Option 2: Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t watch-party .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env watch-party
   ```

3. For production, use Docker Compose to manage both the application and Redis:
   ```yaml
   # docker-compose.yml
   version: '3'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       env_file: .env
       depends_on:
         - redis
     redis:
       image: redis:alpine
       ports:
         - "6379:6379"
   ```

### Option 3: Vercel Deployment

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

3. Set up environment variables in the Vercel dashboard.
4. Note: You'll need to use an external Redis service like Upstash or Redis Labs.

## SSL Configuration

For production deployments, SSL is required:

1. Obtain an SSL certificate from Let's Encrypt or another provider.
2. Configure your web server (Nginx, Apache) to use the certificate.
3. Ensure all environment variables use `https://` URLs.

## Monitoring and Maintenance

1. Set up application monitoring with tools like New Relic, Datadog, or PM2.
2. Configure log rotation to prevent disk space issues.
3. Set up regular backups of your Redis data if you're storing persistent data.
4. Monitor payment provider webhooks and callbacks for any issues.

## Troubleshooting

### Common Issues

1. **Redis Connection Errors**:
   - Verify Redis is running: `redis-cli ping`
   - Check the Redis URL in your `.env` file
   - Ensure firewall rules allow connections to Redis

2. **Email Sending Failures**:
   - Verify SMTP credentials
   - Check for network restrictions on SMTP ports
   - Test with a service like Mailtrap for debugging

3. **Payment Processing Issues**:
   - Verify API keys for payment providers
   - Check webhook/callback URLs are accessible
   - Test with sandbox/test environments first

### Support Resources

- GitHub Repository: https://github.com/your-username/watch-party
- Issue Tracker: https://github.com/your-username/watch-party/issues
- Email Support: support@your-domain.com

## Security Considerations

1. Keep all API keys and secrets secure
2. Regularly update dependencies
3. Implement rate limiting for API endpoints
4. Use HTTPS for all communications
5. Validate and sanitize all user inputs
6. Implement proper authentication and authorization

## Scaling Considerations

As your user base grows, consider:

1. Implementing a Redis cluster for high availability
2. Using a load balancer for multiple application instances
3. Implementing a CDN for static assets
4. Optimizing database queries and caching strategies
5. Monitoring resource usage and scaling accordingly

## Conclusion

This deployment guide covers the essential steps to get your Watch Party application running in production with all enhanced features. For additional support or custom deployment scenarios, please contact the development team.
