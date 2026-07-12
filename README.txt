================================================================================
 FULL-STACK E-COMMERCE PLATFORM — CAPSTONE PROJECT
================================================================================

DESCRIPTION
--------------------------------------------------------------------------------
A complete full-stack e-commerce platform built as the final capstone project
of the track. It covers the full lifecycle of a production-style web
application:

  - Authentication and role-based access control (Customer / Admin)
  - Product catalog with search, filtering, sorting, and pagination
  - Shopping cart (add, update quantity, remove, live total)
  - Admin product management with image upload
  - Frontend pages fully wired to real backend APIs, with loading, empty,
    and error states handled explicitly
  - User profile update flow and admin dashboard analytics
  - Backend unit and integration tests, frontend component tests
  - Full containerization with Docker and docker-compose
  - Prisma + PostgreSQL integration, MongoDB-backed review/activity hooks
  - Profile update support and admin statistics


TECHNOLOGIES USED
--------------------------------------------------------------------------------
Frontend:
  - React 18 (Create React App)
  - React Router v6
  - Axios (API client with interceptors for auth token + 401 handling)
  - React Context API for global auth/cart state

Backend:
  - Node.js + Express
  - PostgreSQL with Sequelize ORM and Prisma support
  - MongoDB for activity logs and reviews
  - JSON Web Tokens (JWT) for authentication
  - bcryptjs for password hashing
  - Multer for image upload handling

Testing:
  - Jest — backend unit tests
  - Supertest — backend API integration tests
  - React Testing Library — frontend component tests
  - Mock Service Worker (MSW) — API mocking in frontend tests

DevOps:
  - Docker (separate Dockerfile for frontend and backend)
  - docker-compose (orchestrates Postgres, MongoDB, backend, and frontend together)
  - Nginx (serves the production frontend build)


PROJECT STRUCTURE
--------------------------------------------------------------------------------
ecommerce-platform/
├── backend/
│   ├── src/
│   │   ├── config/          Database connection (Postgres; test setup uses PostgreSQL)
│   │   ├── models/          Sequelize models: User, Product, CartItem, Category
│   │   ├── middleware/      Auth, role guard, upload, error handling
│   │   ├── controllers/     Business logic for auth, products, cart, admin stats
│   │   ├── routes/          Express route definitions for auth, products, cart, admin
│   │   └── utils/           JWT helpers, pagination helper, mail helper
│   ├── tests/
│   │   ├── unit/            Jest unit tests (pure functions, middleware)
│   │   └── integration/     Supertest API integration tests
│   ├── scripts/seed.js      Seeds admin/customer accounts + sample products
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/             Axios instance + endpoint-specific API calls
│   │   ├── context/         AuthContext, CartContext (global state)
│   │   ├── components/      ProductList, ProductCard, SearchBar (+ tests)
│   │   ├── pages/           Home, Login, Register, Product Detail, Cart, Admin
│   │   ├── routes/          ProtectedRoute (auth + role gating)
│   │   └── mocks/           MSW handlers for testing
│   └── Dockerfile
└── docker-compose.yml


HOW TO RUN — OPTION 1: DOCKER (RECOMMENDED)
--------------------------------------------------------------------------------
Prerequisites: Docker and Docker Compose installed.

  1. Copy the root env file:
       cp .env.example .env
     (edit values if desired — defaults work out of the box)

  2. From the project root, run:
       docker-compose up --build

  3. Once containers are healthy, seed the database with test accounts and
     sample products (from a separate terminal):
       docker exec -it ecommerce_backend npm run seed

  4. Open the app:
       Frontend: http://localhost:3000
       Backend API: http://localhost:5000/api
       Health check: http://localhost:5000/api/health


HOW TO RUN — OPTION 2: MANUAL / LOCAL DEVELOPMENT
--------------------------------------------------------------------------------
Prerequisites: Node.js 20+, PostgreSQL running locally.

Backend:
  1. cd backend
  2. cp .env.example .env   (update DB credentials to match your local Postgres)
  3. npm install
  4. npm run seed            (creates test accounts + sample products)
  5. npm run dev              (starts on http://localhost:5000)

Frontend:
  1. cd frontend
  2. cp .env.example .env
  3. npm install
  4. npm start                 (starts on http://localhost:3000)


RUNNING TESTS
--------------------------------------------------------------------------------
Backend (Jest unit tests + Supertest integration tests):
  cd backend
  npm test

  Notes:
    - Integration tests run against an in-memory SQLite database
      (configured automatically when NODE_ENV=test), so no live Postgres
      instance is required to run the test suite.
    - Coverage report is generated automatically in backend/coverage/.

Frontend (React Testing Library + MSW):
  cd frontend
  npm test

  Notes:
    - MSW intercepts all API calls during tests, so the frontend test suite
      does not require the backend to be running.


PROJECT URLS
--------------------------------------------------------------------------------
  Frontend (local):        http://localhost:3000
  Backend API (local):     http://localhost:5000/api
  API Health Check:        http://localhost:5000/api/health
  GitHub Repository:       https://github.com/abdallah-mohammed-atia/project.git


TEST ACCOUNT CREDENTIALS
--------------------------------------------------------------------------------
After running "npm run seed" (or "docker exec -it ecommerce_backend npm run
seed"), the following accounts are available:

  ADMIN ACCOUNT
    Email:    admin@example.com
    Password: Admin123!
    Role:     admin — can create, edit, and delete products via /admin

  CUSTOMER ACCOUNT
    Email:    customer@example.com
    Password: Customer123!
    Role:     customer — can browse products and use the shopping cart


KEY API ENDPOINTS
--------------------------------------------------------------------------------
  POST   /api/auth/register        Register a new customer account
  POST   /api/auth/login           Log in, returns a JWT
  GET    /api/auth/me              Get the current authenticated user
  PUT    /api/auth/me              Update the current authenticated user profile

  GET    /api/products             List products (search, category, sortBy,
                                     order, minPrice, maxPrice, page, limit)
  GET    /api/products/:id         Get a single product
  POST   /api/products             Create a product (admin only, supports
                                     multipart image upload)
  PUT    /api/products/:id         Update a product (admin only)
  DELETE /api/products/:id         Delete a product (admin only)

  GET    /api/admin/stats          Get admin overview stats

  GET    /api/cart                 Get the current user's cart + total
  POST   /api/cart                 Add an item to the cart
  PUT    /api/cart/:id             Update a cart item's quantity
  DELETE /api/cart/:id             Remove an item from the cart


IMPORTANT NOTES
--------------------------------------------------------------------------------
  - JWT_SECRET in .env.example is a placeholder. Replace it with a long,
    random value before any real deployment.
  - The backend uses sequelize.sync({ alter: true }) in development for
    convenience. For a production deployment, replace this with proper
    Sequelize migrations to avoid unintended schema changes.
  - Uploaded product images are stored on a Docker volume
    (backend_uploads) so they persist across container restarts.
  - If Docker build fails with an invalid file request from node_modules/.bin,
    remove the local backend/node_modules folder and rebuild the containers.
  - Frontend image URLs resolve against REACT_APP_API_ORIGIN or REACT_APP_API_URL,
    and default to http://localhost:5000 in development when no env is provided.
  - Public self-registration always creates a "customer" account; the admin
    account is provisioned via the seed script rather than open registration,
    to avoid unrestricted privilege escalation.
  - CORS is currently open (any origin) for ease of local development and
    grading. Restrict this to your specific frontend domain before any real
    production deployment.


================================================================================
