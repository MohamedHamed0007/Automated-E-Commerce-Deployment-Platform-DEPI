# Shipsphere - Logistics Aggregator Platform

A full-stack logistics aggregator platform with a React + TypeScript + Vite frontend and a Node.js/Express.js + TypeScript backend.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview
Shipsphere is a logistics aggregator platform that connects shippers with carriers, providing tools for shipment tracking, rate comparison, and logistics management.

## Features
- User authentication and authorization
- Shipment creation and tracking
- Rate comparison across multiple carriers
- Real-time shipment updates
- Payment processing integration
- Admin dashboard for managing users and shipments
- Responsive UI for mobile and desktop

## Tech Stack

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context/Zustand (TBD)
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **Payment Processing:** Stripe
- **Shipping APIs:** Shippo
- **Email Service:** Nodemailer
- **Real-time Communication:** Socket.IO
- **File Storage:** AWS S3 (via Multer-S3)
- **Validation:** Joi/Zod
- **Testing:** Jest

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance (local or cloud)
- AWS account (for S3 storage)
- Stripe account (for payment processing)
- Shippo account (for shipping APIs)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd shipsphere
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```

### Environment Variables

Create `.env` files in both frontend and backend directories based on the examples below.

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shipsphere
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Shippo
SHIPPO_API_KEY=your_shippo_api_key

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name

# Email
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (or the URL shown in the terminal).

## Project Structure
```
shipsphere/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validations/
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
└── README.md
```

## API Documentation
API endpoints are documented using Swagger/OpenAPI. Once the backend is running, visit `http://localhost:5000/api-docs` to view the interactive API documentation.

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.
