# E-Commerce Cart Application

A full-stack e-commerce cart application built with React, Node.js, Express, and MongoDB.

## Features

- Product listing with images and prices
- Add/remove items from cart
- Update item quantities
- Real-time total calculation
- Checkout form with name and email
- Order receipt generation
- Responsive design for mobile and desktop
- Professional UI with header, footer, and navigation
- Product search functionality
- Category filtering
- Hero section with promotional content

## Tech Stack

- **Frontend**: React with Vite
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Styling**: CSS3 (Modern, responsive design)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd e-com
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   ```

4. Start the development server:
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately
   npm run server:dev  # Backend
   npm run dev         # Frontend
   ```

## API Endpoints

### Products
- `GET /api/products` - Fetch all products
- `POST /api/products` - Create a new product
- `PUT /api/products` - Seed products (special endpoint)

### Cart
- `GET /api/cart` - Get all cart items
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:id` - Remove item from cart

### Checkout
- `POST /api/checkout` - Process checkout

## Project Structure

```
e-com/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── src/
│   ├── components/
│   ├── services/
│   ├── App.jsx
│   ├── App.css
│   └── index.css
├── .env
├── package.json
└── README.md
```

## Development

### Frontend
The frontend is built with React and Vite. Key components include:
- Product listing with enhanced UI
- Shopping cart with improved UX
- Checkout form with validation
- Order receipt
- Professional header with search and navigation
- Hero section with call-to-action
- Category filtering
- Comprehensive footer with multiple sections

### Backend
The backend is built with Node.js and Express. It includes:
- RESTful API endpoints
- MongoDB integration with Mongoose
- Product, CartItem, and Order models
- Error handling and validation

## Recent Improvements

### UI/UX Enhancements
- Added professional header with logo, search bar, and navigation
- Implemented hero section with promotional content
- Created category filtering system
- Designed comprehensive footer with multiple information sections
- Improved product card design with better spacing and visual hierarchy
- Enhanced responsive design for all device sizes
- Added visual feedback for interactive elements

### Functionality Improvements
- Added product search functionality
- Implemented category filtering
- Improved error handling and user feedback
- Enhanced cart management with better state handling
- Added loading states for better user experience

## Deployment

To build the frontend for production:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

## Future Enhancements

- User authentication and profiles
- Payment integration
- Order history
- Advanced product search and filtering
- Inventory management
- Admin dashboard
- Product reviews and ratings
- Wishlist functionality

## License

This project is for educational purposes only.