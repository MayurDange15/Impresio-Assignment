# Impresio-Assignment

This is the backend for the Impresio assignment, a full-stack AI-powered photography service marketplace.

## Features

- Role-based authentication (client, partner, admin)
- Partner onboarding and verification
- Inquiry/lead management system
- Portfolio management for partners
- Admin APIs for moderation and stats

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MayurDange15/Impresio-Assignment.git
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the project and add the following environment variables:
   ```
   PORT=3000
   MONGO_URI=mongodatabaselink
   JWT_SECRET=thisisasecretkeythatshouldbelonger
   ```
4. Start the server:
   ```bash
   npm start
   ```

The server will be running on `http://localhost:3000`.

## API Endpoints

A Postman collection with all the API endpoints is included in the submission.

### Authentication

- `POST /api/auth/signup` - Register a new user (client, partner, or admin).
- `POST /api/auth/login` - Login a user and get a JWT.

### Inquiries

- `POST /api/inquiry` - Create a new inquiry (client only).

### Partners

- `POST /api/partner/profile` - Submit a partner profile for verification.
- `GET /api/partner/leads` - Get assigned leads for a partner.
- `POST /api/partner/portfolio` - Add a new item to a partner's portfolio.
- `GET /api/partner/portfolio` - Get a partner's portfolio.
- `PUT /api/partner/portfolio/:id` - Update a portfolio item.
- `DELETE /api/partner/portfolio/:id` - Delete a portfolio item.

### Admin

- `GET /api/admin/verifications` - Get all pending partner verifications.
- `PUT /api/admin/verify/:id` - Approve or reject a partner's verification.
- `GET /api/admin/stats` - Get platform statistics.
- `GET /api/admin/reviews` - Get all reviews.
- `POST /api/admin/reviews` - Create a new review.
- `GET /api/admin/reviews/:id` - Get a single review.
- `PUT /api/admin/reviews/:id` - Update a review.
- `DELETE /api/admin/reviews/:id` - Delete a review.
- `GET /api/admin/categories` - Get all categories.
- `POST /api/admin/categories` - Create a new category.
- `GET /api/admin/categories/:id` - Get a single category.
- `PUT /api/admin/categories/:id` - Update a category.
- `DELETE /api/admin/categories/:id` - Delete a category.
- `GET /api/admin/locations` - Get all locations.
- `POST /api/admin/locations` - Create a new location.
- `GET /api/admin/locations/:id` - Get a single location.
- `PUT /api/admin/locations/:id` - Update a location.
- `DELETE /api/admin/locations/:id` - Delete a location.
