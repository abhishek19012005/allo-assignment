# Allo Assignment

## Tech Stack
- Next.js
- TypeScript
- Prisma
- PostgreSQL
- Supabase

## Features
- Product inventory management
- Stock reservation system
- Reservation confirmation
- Inventory decrement handling
- Concurrency-safe transactions

## APIs

### Get Products
GET /api/products

### Create Reservation
POST /api/reservations

Body:
{
  "productId": 1,
  "warehouseId": 1,
  "quantity": 1
}

### Confirm Reservation
POST /api/reservations/:id/confirm

## Concurrency Handling

Implemented transactional reservation logic using Prisma transactions and PostgreSQL row-level updates to avoid overselling.