# E-commerce Platform

A full-stack e-commerce platform built with React + Vite (Frontend) and Node.js + Express (Backend).

## Deployed Link
Frontend: https://edgistify-ecom.vercel.app/auth
Backend: https://edgistify-backend.vercel.app

## 🚀 Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- JS-Cookie for token management

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Bcrypt for password hashing

## 🛠️ Installation & Setup

### Frontend Setup
```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start server
npm run dev
```

### Environment Variables
#### Backend (.env)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

## 📝 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}
```

### Product Endpoints

#### Get Products (Paginated)
```http
GET /api/products?page=1&limit=10
```

#### Add Product (Admin)
```http
POST /api/admin/product/add
Authorization: Bearer <admin_token>
Content-Type: application/json

{
    "name": "New Product",
    "price": 100,
    "stock": 50
}
```

#### Bulk Add Products (Admin)
```http
POST /api/admin/product/bulk-add
Authorization: Bearer <admin_token>
Content-Type: application/json

{
    "products": [
        {
            "name": "Product 1",
            "price": 10,
            "stock": 100
        },
        {
            "name": "Product 2",
            "price": 20,
            "stock": 50
        }
    ]
}
```

### Cart Endpoints

#### Get Cart Items
```http
GET /api/cart
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
    "productId": "<product_id>",
    "quantity": 2
}
```

#### Clear Cart
```http
DELETE /api/cart/delete
Authorization: Bearer <token>
```

#### Remove Cart Item
```http
DELETE /api/cart/delete/<cart_item_id>
Authorization: Bearer <token>
```

### Order Endpoints

#### Place Order
```http
POST /api/orders/place
Authorization: Bearer <token>
Content-Type: application/json

{
    "shippingAddress": "123 Main Street, City, Country"
}
```

#### Get Orders
```http
GET /api/orders
Authorization: Bearer <token>
```

## 🔒 Authentication

The platform uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header for protected routes:

```http
Authorization: Bearer <your_token>
```

## 🔑 Protected Routes

The following routes require authentication:
- All cart operations
- Order operations
- Admin product management

Admin routes additionally require an admin role in the JWT token.

## 💻 Frontend Structure

```
src/
├── components/
│   ├── ui/          # Shadcn UI components
│   └── products/    # Product-related components
├── pages/           # Route pages
├── hooks/           # Custom hooks
├── lib/             # Utilities
└── types/           # TypeScript types
```

## 🌐 Backend Structure

```
src/
├── middleware/      # Custom middleware
├── models/         # MongoDB models
├── routes/         # API routes
├── utils/          # Utilities
└── config/         # Configuration

postman_collection.json
```


