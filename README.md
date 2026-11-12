# Nexa — E-Commerce Web Application

**Discover More. Shop Better.**

Nexa is a responsive e-commerce web application developed as part of the **Route Academy Front-End Diploma**.

Built with Next.js, React, and TypeScript, Nexa provides product browsing, authentication, wishlist management, shopping cart operations, and checkout functionality through the Route Academy E-Commerce API.

## Live Demo

**Deployment:** Vercel

Live URL: _To be added after deployment._

## Features

### Authentication

- User registration and login
- Forgot password and password recovery
- Change password
- Protected authenticated pages

### Product Catalog

- Homepage with featured products and categories
- Product listings with pagination
- Product details with interactive image gallery
- Brand and category listings
- Brand and category detail pages

### Wishlist

- Add and remove favorite products
- View saved products
- Synchronize wishlist indicators with user actions

### Shopping Cart

- Add and remove products
- Increase and decrease product quantities
- Calculate cart subtotals
- Prevent checkout navigation while cart updates are pending

### Checkout & Orders

- Shipping information form
- Cash on Delivery
- Stripe-hosted online checkout
- Order history

### User Interface

- Responsive desktop and mobile layouts
- Loading and error states
- Interactive product galleries
- Consistent navigation and visual identity

## Tech Stack

| Technology      | Purpose                        |
| --------------- | ------------------------------ |
| Next.js 16      | React framework and App Router |
| React 19        | Component-based UI             |
| TypeScript      | Type safety                    |
| Tailwind CSS 4  | Styling                        |
| NextAuth.js 4   | Authentication                 |
| React Hook Form | Form management                |
| Zod             | Schema validation              |
| Framer Motion   | UI animations                  |
| Base UI React   | UI primitives                  |
| Lucide React    | Icons                          |

## Getting Started

### Prerequisites

- Node.js 20.9.0 or later
- npm

### Local Setup

1. Clone this repository.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Configure the environment variables.
5. Run `npm run dev`.
6. Open `http://localhost:3000`.

### Environment Variables

| Variable                   | Purpose                        |
| -------------------------- | ------------------------------ |
| `API_BASE_URL`             | Server-side API base URL       |
| `NEXT_PUBLIC_API_BASE_URL` | Client-accessible API base URL |
| `NEXTAUTH_URL`             | Application authentication URL |
| `NEXTAUTH_SECRET`          | Secret used by NextAuth.js     |

Refer to `.env.example` for the configuration template.

Never commit actual credentials or secrets to the repository.

## Available Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Create a production build    |
| `npm run start` | Start the production server  |
| `npm run lint`  | Run ESLint                   |

## Deployment

Nexa is designed for deployment on **Vercel**.

To deploy:

1. Import the GitHub repository into Vercel.
2. Select the Next.js framework preset.
3. Configure the required environment variables.
4. Deploy the application.
5. Verify authentication, catalog, cart, checkout, and orders on the deployed URL.

Production authentication configuration must match the deployed application URL.

## API Reference

Nexa integrates with the Route Academy E-Commerce API.

[Route E-Commerce API Documentation](https://documenter.getpostman.com/view/5709532/2s93JqTRWN)

## Project Context

This project was developed for the **Route Academy Front-End Diploma**, applying Next.js App Router, React, TypeScript, API integration, authentication, and application state management in a practical e-commerce assignment.

## Author

**Karim Akmal**

[GitHub Profile](https://github.com/KarimAkmal88)
