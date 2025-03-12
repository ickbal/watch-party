# Development Guide

This document provides information for developers who want to contribute to or extend the Watch Party application.

## Development Environment Setup

### Prerequisites

- Node.js 16.x or higher
- Redis 6.x or higher
- Git

### Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/watch-party.git
cd watch-party
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with the following variables:
```
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-development-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Redis
REDIS_URL=redis://localhost:6379

# Email Configuration (for development)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-username
SMTP_PASSWORD=your-mailtrap-password
SMTP_FROM_EMAIL=dev@example.com
SMTP_FROM_NAME=Watch Party Dev

# Payment Providers (for development)
CRYPTAPI_API_KEY=your-cryptapi-api-key
COINGATE_API_KEY=your-coingate-api-key
COINGATE_ENVIRONMENT=sandbox
```

4. Start Redis:
```bash
# Linux
sudo systemctl start redis-server

# macOS
brew services start redis

# Windows
# Start Redis server from the installation directory
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Architecture

### Frontend

The frontend is built with Next.js and React, using TailwindCSS for styling. The main components are:

- **Layout**: Contains the common layout elements like navigation and footer
- **Room**: Manages the watch party room interface
- **Player**: Handles video playback and synchronization
- **Chat**: Provides real-time chat functionality
- **Support**: Implements the support system with feedback forms
- **Payment**: Handles subscription plans and cryptocurrency payments

### Backend

The backend is implemented using Next.js API routes and Socket.IO for real-time communication:

- **Authentication**: Handled by NextAuth.js
- **API Routes**: Implement RESTful endpoints for various features
- **Socket.IO**: Manages real-time communication for chat and video synchronization
- **Redis**: Stores room state, chat history, and user sessions

## Code Structure

### Component Organization

Components are organized by feature and follow a consistent pattern:

```
components/
├── feature/
│   ├── FeatureComponent.tsx       # Main component
│   ├── FeatureSubComponent.tsx    # Sub-components
│   └── index.ts                   # Export all components
```

### API Organization

API routes are organized by feature:

```
pages/api/
├── feature/
│   ├── index.ts                   # Main endpoint
│   └── [id].ts                    # Dynamic endpoint
```

### Type Definitions

TypeScript types are defined in dedicated files:

```
lib/
├── feature-types.ts               # Types for specific features
└── types.ts                       # Common types
```

## Development Workflow

### Adding a New Feature

1. Create a new branch from `main`:
```bash
git checkout -b feature/your-feature-name
```

2. Implement the feature:
   - Add necessary components in `components/`
   - Add API routes in `pages/api/`
   - Add types in `lib/`
   - Add tests in `__tests__/`

3. Test your changes locally:
```bash
npm run test
npm run lint
```

4. Submit a pull request to the `main` branch

### Code Style and Conventions

- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use functional components with hooks for React components
- Use async/await for asynchronous code
- Write meaningful commit messages

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run specific tests
npm run test -- -t "test name"
```

### Writing Tests

- Place test files alongside the code they test with a `.test.ts` or `.test.tsx` extension
- Use Jest for unit tests
- Use React Testing Library for component tests
- Use Cypress for end-to-end tests

## Deployment

### Development Deployment

For development and testing, you can use Vercel's preview deployments:

```bash
npm install -g vercel
vercel
```

### Production Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for production deployment instructions.

## Extending the Application

### Adding a New Video Source

1. Create a new player adapter in `components/player/adapters/`:
```typescript
// components/player/adapters/NewSourceAdapter.tsx
import { PlayerAdapter } from '../../../lib/types';

export const NewSourceAdapter: PlayerAdapter = {
  name: 'New Source',
  canPlay: (url) => /newsource\.com/.test(url),
  getVideoId: (url) => {
    // Extract video ID from URL
    return 'video-id';
  },
  Player: ({ videoId, onReady, onStateChange, ...props }) => {
    // Implement player component
    return <div>New Source Player</div>;
  }
};
```

2. Register the adapter in `components/player/PlayerFactory.tsx`

### Adding a New Payment Provider

1. Create a new payment provider adapter in `lib/payment/`:
```typescript
// lib/payment/newprovider.ts
import { PaymentProvider } from '../payment-types';

export const NewProvider: PaymentProvider = {
  name: 'New Provider',
  createPayment: async (amount, currency) => {
    // Implement payment creation
    return {
      address: 'payment-address',
      amount: amount,
      currency: currency
    };
  },
  checkPaymentStatus: async (address) => {
    // Implement status checking
    return {
      status: 'pending',
      confirmations: 0
    };
  }
};
```

2. Register the provider in `pages/api/payment/create.ts` and `pages/api/payment/status.ts`

## Troubleshooting

### Common Development Issues

- **Redis Connection Issues**: Ensure Redis is running and the REDIS_URL is correct
- **Authentication Errors**: Verify your OAuth credentials and NEXTAUTH_SECRET
- **API Route Errors**: Check the server logs for detailed error messages
- **Socket.IO Connection Issues**: Ensure the client and server are using compatible versions

### Getting Help

If you encounter issues not covered in this guide:

1. Check the existing GitHub issues
2. Search the project documentation
3. Create a new issue with detailed information about the problem

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Socket.IO Documentation](https://socket.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
