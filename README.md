# Portfolio Backend API

A robust backend API for a personal portfolio website built with Node.js, Express, TypeScript, and MongoDB.

## Features

### 🔐 Authentication & Authorization

-   JWT-based authentication
-   Role-based access control (Owner & Regular users)
-   Secure password hashing with bcrypt
-   Protected routes for sensitive operations
-   **Automatic owner user creation on server startup**

### 📝 Blog Management

-   Create, read, update, delete blogs
-   Markdown content support
-   Category filtering and search
-   Published/draft status
-   Author-based blog filtering
-   Pagination support

### 🚀 Project Showcase

-   Complete project CRUD operations
-   Featured projects highlighting
-   Technology stack filtering
-   Project status tracking (Planning, In Progress, Completed)
-   Multiple URL support (frontend, backend, GitHub repos)
-   Advanced search and filtering

### 👤 User Management

-   User registration and authentication
-   Profile management
-   Password change functionality
-   Owner-only dashboard access

## Tech Stack

-   **Runtime:** Node.js
-   **Framework:** Express.js
-   **Language:** TypeScript
-   **Database:** MongoDB with Mongoose ODM
-   **Authentication:** JWT + bcrypt
-   **Validation:** Custom validation utilities
-   **Error Handling:** Centralized error handling middleware

## Quick Start

### Prerequisites

-   Node.js (v16 or higher)
-   MongoDB (local or cloud)
-   npm or yarn

### Installation Steps

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd portfolio-backend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Configuration**

    ```bash
    cp .env.example .env
    ```

    Update the `.env` file with your configuration:

    ```env
    PORT=5000
    NODE_ENV=development
    MONGODB_URI=mongodb://localhost:27017/portfolio
    JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
    JWT_EXPIRES_IN=7d
    DEVELOPMENT_FRONTEND_URL=http://localhost:3000
    PRODUCTION_FRONTEND_URL=https://your-frontend-domain.com
    BCRYPT_SALT_ROUNDS=12

    # Owner user credentials (auto-created on startup)
    OWNER_NAME=Portfolio Owner
    OWNER_EMAIL=owner@portfolio.com
    OWNER_PASSWORD=owner123456
    ```

4. **Start the server**

    ```bash
    # Development mode
    npm run dev

    # Production mode
    npm run build
    npm start
    ```

    **🎉 That's it!** The server will:

    - Connect to MongoDB
    - Automatically create an owner user (if one doesn't exist)
    - Start listening on the specified port

    Check the console output for the owner credentials.

## API Endpoints

### Authentication Routes (`/api/v1/auth`)

```
POST   /register          - Register new user
POST   /login             - User login
GET    /profile           - Get user profile (Protected)
PATCH  /profile           - Update user profile (Protected)
PATCH  /change-password   - Change password (Protected)
```

### Blog Routes (`/api/v1/blogs`)

```
GET    /                  - Get all blogs (with filters)
GET    /published         - Get published blogs only
GET    /author/:authorId  - Get blogs by specific author
GET    /:id               - Get single blog
POST   /                  - Create blog (Owner only)
PATCH  /:id               - Update blog (Author/Owner only)
DELETE /:id               - Delete blog (Author/Owner only)
```

### Project Routes (`/api/v1/projects`)

```
GET    /                  - Get all projects (with filters)
GET    /featured          - Get featured projects
GET    /status/:status    - Get projects by status
GET    /tech/:tech        - Get projects by technology
GET    /:id               - Get single project
POST   /                  - Create project (Owner only)
PATCH  /:id               - Update project (Owner only)
DELETE /:id               - Delete project (Owner only)
```

## Owner User

The system automatically creates an owner user when the server starts for the first time. The credentials are:

-   **Email:** `owner@portfolio.com` (or value from `OWNER_EMAIL` env var)
-   **Password:** `owner123456` (or value from `OWNER_PASSWORD` env var)

**⚠️ Important:** Change the default password after first login!

## API Usage Examples

### Authentication

```javascript
// Register
POST /api/v1/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

// Login
POST /api/v1/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Creating a Blog (Owner only)

```javascript
POST /api/v1/blogs
Headers: { "Authorization": "Bearer <jwt-token>" }
{
  "title": "My First Blog",
  "content": "# Hello World\n\nThis is my first blog post written in **markdown**.",
  "categories": ["tech", "programming"],
  "bannerImage": "https://example.com/image.jpg",
  "isPublished": true
}
```

### Creating a Project (Owner only)

```javascript
POST /api/v1/projects
Headers: { "Authorization": "Bearer <jwt-token>" }
{
  "title": "My Portfolio Website",
  "shortDescription": "A modern portfolio website built with Next.js",
  "longDescription": "## Overview\n\nThis project showcases my skills...",
  "techStacks": ["Next.js", "TypeScript", "Tailwind CSS"],
  "urls": {
    "frontend": "https://myportfolio.com",
    "githubFrontend": "https://github.com/user/portfolio"
  },
  "bannerImage": "https://example.com/project-image.jpg",
  "status": "Completed",
  "featured": true
}
```

## Error Handling

The API uses centralized error handling with consistent responses:

```javascript
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:

-   `200` - Success
-   `201` - Created
-   `400` - Bad Request
-   `401` - Unauthorized
-   `403` - Forbidden
-   `404` - Not Found
-   `500` - Internal Server Error

## Security Features

-   **Password Hashing:** bcrypt with configurable salt rounds
-   **JWT Authentication:** Secure token-based authentication
-   **Role-based Access:** Owner and regular user roles
-   **Input Validation:** Comprehensive validation for all inputs
-   **CORS Configuration:** Configurable cross-origin resource sharing
-   **Error Information:** Sanitized error messages in production

## Project Structure

```
src/
├── app/
│   ├── middlewares/
│   │   ├── auth.ts              # Authentication middleware
│   │   └── errorHandler.ts     # Error handling middleware
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.route.ts
│   │   │   └── auth.service.ts
│   │   ├── blog/
│   │   │   ├── blog.controller.ts
│   │   │   ├── blog.model.ts
│   │   │   ├── blog.route.ts
│   │   │   └── blog.service.ts
│   │   ├── project/
│   │   │   ├── project.controller.ts
│   │   │   ├── project.model.ts
│   │   │   ├── project.route.ts
│   │   │   └── project.service.ts
│   │   └── user/
│   │       ├── user.controller.ts
│   │       ├── user.model.ts
│   │       ├── user.route.ts
│   │       └── user.service.ts
│   ├── routes/
│   │   └── index.ts             # Main route aggregator
│   └── utils/
│       ├── database.ts          # Database connection utility
│       ├── response.ts          # Response formatting utility
│       ├── seedOwner.ts         # Owner user seeding utility
│       └── validation.ts       # Validation utilities
├── app.ts                       # Express app configuration
└── server.ts                    # Server startup with auto-seeding
```

## Data Models

### User Model

```typescript
{
  name: string,
  email: string,
  password: string,
  role: "regular" | "owner",
  timestamps: true
}
```

### Blog Model

```typescript
{
  title: string,
  content: string,        // Markdown content
  author: ObjectId,       // User reference
  categories: string[],
  bannerImage: string,    // URL
  isPublished: boolean,
  timestamps: true
}
```

### Project Model

```typescript
{
  title: string,
  shortDescription: string,
  longDescription: string,    // Markdown content
  techStacks: string[],
  urls: {
    frontend?: string,
    backend?: string,
    githubFrontend?: string,
    githubBackend?: string
  },
  bannerImage: string,        // URL
  status: "Planning" | "In Progress" | "Completed",
  featured: boolean,
  timestamps: true
}
```

## Testing

The API has been thoroughly tested with all endpoints verified to be working correctly. See the test files in the root directory for examples.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
