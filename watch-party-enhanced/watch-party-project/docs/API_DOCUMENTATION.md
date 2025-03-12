# API Documentation

This document provides detailed information about the Watch Party API endpoints, including the newly implemented support system and cryptocurrency payment system.

## Table of Contents

1. [Authentication](#authentication)
2. [Room Management](#room-management)
3. [User Management](#user-management)
4. [Support System](#support-system)
5. [Payment System](#payment-system)
6. [Subscription Management](#subscription-management)

## Authentication

### Sign In

```
POST /api/auth/signin
```

Authenticates a user and creates a session.

### Sign Out

```
POST /api/auth/signout
```

Ends the current user session.

### Session

```
GET /api/auth/session
```

Returns information about the current session.

## Room Management

### Create Room

```
POST /api/room
```

Creates a new watch party room.

**Request Body:**
```json
{
  "name": "Movie Night",
  "isPrivate": false
}
```

**Response:**
```json
{
  "id": "room123",
  "name": "Movie Night",
  "isPrivate": false,
  "createdAt": "2025-03-11T15:30:00Z",
  "createdBy": "user456"
}
```

### Join Room

```
POST /api/room/:id/join
```

Joins an existing watch party room.

**Response:**
```json
{
  "success": true,
  "room": {
    "id": "room123",
    "name": "Movie Night",
    "isPrivate": false,
    "createdAt": "2025-03-11T15:30:00Z",
    "createdBy": "user456",
    "participants": ["user456", "user789"]
  }
}
```

### Get Room

```
GET /api/room/:id
```

Retrieves information about a specific room.

### List Rooms

```
GET /api/rooms
```

Lists all public rooms or rooms created by the current user.

## User Management

### Get User

```
GET /api/user/:id
```

Retrieves information about a specific user.

### Update User

```
PUT /api/user/:id
```

Updates user information.

**Request Body:**
```json
{
  "name": "John Doe",
  "avatar": "https://example.com/avatar.jpg"
}
```

## Support System

### Submit Feedback

```
POST /api/support/feedback
```

Submits user feedback or support request.

**Request Body:**
```json
{
  "subject": "Feature Request",
  "category": "suggestion",
  "message": "I would like to suggest adding a feature to...",
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "status": "success",
  "ticketId": "ticket123",
  "message": "Your feedback has been submitted successfully"
}
```

### Get Support Categories

```
GET /api/support/categories
```

Retrieves available support categories.

**Response:**
```json
{
  "categories": [
    "technical_issue",
    "billing_question",
    "feature_request",
    "general_feedback",
    "bug_report"
  ]
}
```

## Payment System

### Create Payment

```
POST /api/payment/create
```

Creates a new payment request for cryptocurrency payment.

**Request Body:**
```json
{
  "planId": "premium",
  "provider": "cryptapi",
  "amount": 10,
  "currency": "USD"
}
```

**Response:**
```json
{
  "status": "success",
  "paymentId": "pay_123456789",
  "address": "btc_address_abc123",
  "amount": 0.00045,
  "currency": "BTC"
}
```

### Check Payment Status

```
POST /api/payment/status
```

Checks the status of a cryptocurrency payment.

**Request Body:**
```json
{
  "provider": "cryptapi",
  "address": "btc_address_abc123"
}
```

**Response:**
```json
{
  "status": "confirmed",
  "txid": "tx_987654321",
  "confirmations": 3
}
```

## Subscription Management

### Get Subscription

```
GET /api/subscription
```

Retrieves the current user's subscription information.

**Response:**
```json
{
  "status": "success",
  "subscription": {
    "userId": "user123",
    "planId": "premium",
    "status": "active",
    "startDate": "2025-03-11T15:30:00Z",
    "endDate": "2025-04-11T15:30:00Z",
    "paymentInfo": {
      "provider": "cryptapi",
      "amount": 10,
      "currency": "USD",
      "status": "confirmed",
      "txid": "tx_987654321",
      "confirmations": 6,
      "createdAt": "2025-03-11T15:30:00Z",
      "updatedAt": "2025-03-11T15:35:00Z"
    },
    "autoRenew": false
  }
}
```

### Create/Update Subscription

```
POST /api/subscription
```

Creates or updates a subscription after payment.

**Request Body:**
```json
{
  "planId": "premium",
  "paymentId": "pay_123456789",
  "txid": "tx_987654321"
}
```

**Response:**
```json
{
  "status": "success",
  "subscriptionId": "sub_123456789",
  "subscription": {
    "userId": "user123",
    "planId": "premium",
    "status": "active",
    "startDate": "2025-03-11T15:30:00Z",
    "endDate": "2025-04-11T15:30:00Z",
    "paymentInfo": {
      "provider": "cryptapi",
      "amount": 10,
      "currency": "USD",
      "status": "confirmed",
      "txid": "tx_987654321",
      "confirmations": 6,
      "createdAt": "2025-03-11T15:30:00Z",
      "updatedAt": "2025-03-11T15:35:00Z"
    },
    "autoRenew": false
  }
}
```

### Cancel Subscription

```
DELETE /api/subscription
```

Cancels the current user's subscription.

**Request Body:**
```json
{
  "subscriptionId": "sub_123456789"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Subscription cancelled successfully"
}
```
