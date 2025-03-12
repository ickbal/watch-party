# Watch Party - Enhanced Version

A real-time synchronized video watching platform with advanced features including:

- Multi-source video platform support (YouTube, Vimeo, etc.)
- Advanced chat capabilities with rich text and GIFs
- Accessibility features and keyboard shortcuts
- Scheduled watch parties with calendar integration
- Support system with email feedback functionality
- Cryptocurrency payment system for subscriptions

## Features

### Core Features
- Synchronized video playback across multiple users
- Real-time chat during watch sessions
- Room creation and management
- User authentication

### Enhanced Features
- **Multi-source Video Support**: Watch content from YouTube, Vimeo, and other platforms
- **Advanced Chat**: Rich text formatting, GIF support, and reactions
- **Accessibility**: Keyboard shortcuts and screen reader compatibility
- **Scheduled Events**: Create and manage watch parties with calendar integration
- **Support System**: Email-based feedback and support ticketing
- **Cryptocurrency Payments**: Subscribe using various cryptocurrencies

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- Redis 6.x or higher
- SMTP server for email functionality

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/watch-party.git
cd watch-party
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file based on `.env.example`
```bash
cp .env.example .env
```

4. Update the environment variables in `.env` with your configuration

5. Start the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

For detailed deployment instructions, please refer to [DEPLOYMENT.md](DEPLOYMENT.md).

## Technology Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API routes, Socket.IO
- **Database**: Redis
- **Authentication**: NextAuth.js
- **Payment Processing**: CryptAPI, CoinGate
- **Email**: Nodemailer

## Project Structure

```
watch-party/
├── components/         # React components
│   ├── chat/           # Chat-related components
│   ├── payment/        # Payment and subscription components
│   ├── player/         # Video player components
│   ├── room/           # Room management components
│   ├── support/        # Support system components
│   └── user/           # User-related components
├── lib/                # Utility functions and shared code
├── pages/              # Next.js pages
│   ├── api/            # API routes
│   │   ├── auth/       # Authentication endpoints
│   │   ├── payment/    # Payment processing endpoints
│   │   ├── room/       # Room management endpoints
│   │   └── support/    # Support system endpoints
│   └── room/           # Room pages
├── public/             # Static assets
├── styles/             # CSS styles
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Socket.IO](https://socket.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [CryptAPI](https://cryptapi.io/)
- [CoinGate](https://coingate.com/)
