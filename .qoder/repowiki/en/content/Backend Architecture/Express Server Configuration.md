# Express Server Configuration

<cite>
**Referenced Files in This Document**
- [index.js](file://backend/index.js)
- [package.json](file://backend/package.json)
- [error.js](file://backend/middleware/error.js)
- [ApiError.js](file://backend/utils/ApiError.js)
- [ApiResponse.js](file://backend/utils/ApiResponse.js)
- [db.js](file://backend/db/db.js)
- [auth.js](file://backend/middleware/auth.js)
- [validate.js](file://backend/middleware/validate.js)
- [authRoutes.js](file://backend/routes/authRoutes.js)
- [productRoutes.js](file://backend/routes/productRoutes.js)
- [orderRoutes.js](file://backend/routes/orderRoutes.js)
- [asyncHandler.js](file://backend/utils/asyncHandler.js)
- [jwt.js](file://backend/utils/jwt.js)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document explains the Express.js server configuration and initialization for the backend. It covers middleware setup (CORS, JSON parsing, URL encoding), environment variable handling, port configuration, CORS policy, development request logging, health checks, error handling, graceful shutdown, and unhandled exception/rejection handling. It also outlines production deployment considerations, security headers, and performance optimizations, along with environment configuration examples and server startup patterns.

## Project Structure
The server entry point initializes Express, connects to MongoDB, configures middleware, mounts routes, and sets up error handling and lifecycle hooks. Supporting utilities provide standardized error and response formats, JWT helpers, and async error handling.

```mermaid
graph TB
A["backend/index.js<br/>Server bootstrap"] --> B["backend/db/db.js<br/>Database connection"]
A --> C["backend/middleware/error.js<br/>Global error handler"]
A --> D["backend/routes/*.js<br/>Route modules"]
D --> E["backend/controllers/*<br/>Route handlers"]
A --> F["backend/utils/ApiError.js<br/>Custom error class"]
A --> G["backend/utils/ApiResponse.js<br/>Standardized responses"]
A --> H["backend/utils/asyncHandler.js<br/>Async wrapper"]
A --> I["backend/utils/jwt.js<br/>JWT utilities"]
A --> J["backend/middleware/auth.js<br/>Auth middleware"]
A --> K["backend/middleware/validate.js<br/>Validation middleware"]
```

**Diagram sources**
- [index.js:1-119](file://backend/index.js#L1-L119)
- [db.js:1-37](file://backend/db/db.js#L1-L37)
- [error.js:1-121](file://backend/middleware/error.js#L1-L121)
- [authRoutes.js:1-85](file://backend/routes/authRoutes.js#L1-L85)
- [productRoutes.js:1-101](file://backend/routes/productRoutes.js#L1-L101)
- [orderRoutes.js:1-77](file://backend/routes/orderRoutes.js#L1-L77)
- [ApiError.js:1-21](file://backend/utils/ApiError.js#L1-L21)
- [ApiResponse.js:1-52](file://backend/utils/ApiResponse.js#L1-L52)
- [asyncHandler.js:1-16](file://backend/utils/asyncHandler.js#L1-L16)
- [jwt.js:1-49](file://backend/utils/jwt.js#L1-L49)
- [auth.js:1-124](file://backend/middleware/auth.js#L1-L124)
- [validate.js:1-221](file://backend/middleware/validate.js#L1-L221)

**Section sources**
- [index.js:1-119](file://backend/index.js#L1-L119)
- [package.json:1-33](file://backend/package.json#L1-L33)

## Core Components
- Express app initialization and middleware pipeline
- CORS configuration with environment-driven origin and credentials support
- Body parsing for JSON and URL-encoded payloads with size limits
- Development-only request logging
- Health check endpoint returning environment and timestamp
- Route mounting for authentication, products, and orders
- Global 404 and error handling middleware
- Database connection via Mongoose
- Lifecycle hooks for graceful shutdown and unhandled error handling

**Section sources**
- [index.js:14-92](file://backend/index.js#L14-L92)
- [db.js:7-21](file://backend/db/db.js#L7-L21)
- [error.js:84-120](file://backend/middleware/error.js#L84-L120)

## Architecture Overview
The server follows a layered architecture:
- Entry point initializes app, loads environment, connects DB, configures middleware, mounts routes, and starts the HTTP server.
- Middleware handles cross-cutting concerns (CORS, logging, validation, authentication).
- Routes delegate to controllers; controllers use async handlers and utilities for consistent responses and errors.
- Error middleware centralizes error translation and response formatting.

```mermaid
graph TB
subgraph "Server Layer"
S["Express App<br/>index.js:14"] --> M1["CORS<br/>index.js:23-30"]
S --> M2["Body Parsing<br/>index.js:20-21"]
S --> M3["Development Logging<br/>index.js:32-38"]
S --> R["Routes<br/>index.js:50-53"]
end
subgraph "Middleware Layer"
V["Validation<br/>validate.js:12"] --> E["Error Handler<br/>error.js:84-103"]
A["Auth<br/>auth.js:10-55"] --> E
end
subgraph "Domain Layer"
R --> AR["Auth Routes<br/>authRoutes.js"]
R --> PR["Product Routes<br/>productRoutes.js"]
R --> OR["Order Routes<br/>orderRoutes.js"]
end
subgraph "Utilities"
U1["ApiError<br/>ApiError.js"] --> E
U2["ApiResponse<br/>ApiResponse.js"] --> AR
U2 --> PR
U2 --> OR
U3["asyncHandler<br/>asyncHandler.js"] --> AR
U3 --> PR
U3 --> OR
U4["JWT<br/>jwt.js"] --> A
end
subgraph "Persistence"
D["MongoDB<br/>db.js:7-21"]
end
S --> D
```

**Diagram sources**
- [index.js:14-92](file://backend/index.js#L14-L92)
- [validate.js:12-25](file://backend/middleware/validate.js#L12-L25)
- [error.js:84-103](file://backend/middleware/error.js#L84-L103)
- [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)
- [authRoutes.js:1-85](file://backend/routes/authRoutes.js#L1-L85)
- [productRoutes.js:1-101](file://backend/routes/productRoutes.js#L1-L101)
- [orderRoutes.js:1-77](file://backend/routes/orderRoutes.js#L1-L77)
- [ApiError.js:5-18](file://backend/utils/ApiError.js#L5-L18)
- [ApiResponse.js:14-46](file://backend/utils/ApiResponse.js#L14-L46)
- [asyncHandler.js:9-13](file://backend/utils/asyncHandler.js#L9-L13)
- [jwt.js:13-29](file://backend/utils/jwt.js#L13-L29)
- [db.js:7-21](file://backend/db/db.js#L7-L21)

## Detailed Component Analysis

### Server Initialization and Startup
- Loads environment variables via dotenv.
- Initializes Express app and connects to MongoDB.
- Configures body parsers with size limits.
- Applies CORS with origin from environment, credentials enabled, and allowed methods/headers.
- Adds development-only request logger.
- Mounts health check and API routes.
- Starts server on configured port with graceful startup banner.
- Registers unhandled rejection and uncaught exception handlers.
- Sets SIGTERM graceful shutdown hook.

```mermaid
sequenceDiagram
participant Proc as "Process"
participant App as "Express App<br/>index.js : 14"
participant DB as "MongoDB<br/>db.js : 7-21"
participant MW as "Middleware<br/>index.js : 19-38"
participant Routes as "Routes<br/>index.js : 50-53"
Proc->>App : require("dotenv").config()
Proc->>App : initialize Express app
App->>DB : connectDB()
DB-->>App : connected
App->>MW : app.use(json/urlencoded)
App->>MW : app.use(cors)
App->>MW : development logger (if dev)
App->>Routes : mount /api/auth, /api/products, /api/orders
App->>Proc : listen(PORT)
Proc-->>App : server.handle
```

**Diagram sources**
- [index.js:1-119](file://backend/index.js#L1-L119)
- [db.js:7-21](file://backend/db/db.js#L7-L21)

**Section sources**
- [index.js:1-119](file://backend/index.js#L1-L119)
- [db.js:7-21](file://backend/db/db.js#L7-L21)

### CORS Policy Configuration
- Origin is controlled by CLIENT_URL environment variable with a fallback to localhost development URL.
- Credentials are enabled to support cookies/auth flows.
- Methods include standard CRUD plus OPTIONS.
- Allowed headers include Content-Type, Authorization, and X-Requested-With.

```mermaid
flowchart TD
Start(["CORS Setup"]) --> O["Origin from CLIENT_URL or default"]
O --> C["Credentials enabled"]
C --> M["Allowed Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS"]
M --> H["Allowed Headers: Content-Type,Authorization,X-Requested-With"]
H --> Apply["Apply cors() middleware"]
Apply --> End(["Active"])
```

**Diagram sources**
- [index.js:23-30](file://backend/index.js#L23-L30)

**Section sources**
- [index.js:23-30](file://backend/index.js#L23-L30)

### Environment Variable Handling and Port Configuration
- NODE_ENV controls development logging and error response modes.
- PORT determines runtime binding; defaults to 5000.
- MONGODB_URI drives database connection.
- CLIENT_URL configures CORS origin.
- JWT_SECRET and JWT_EXPIRE control token signing and expiration.
- Development script uses nodemon; production uses node.

```mermaid
flowchart TD
Env["Environment Variables"] --> N["NODE_ENV"]
Env --> P["PORT (default 5000)"]
Env --> DBURI["MONGODB_URI"]
Env --> ORG["CLIENT_URL (CORS origin)"]
Env --> JWT["JWT_SECRET & JWT_EXPIRE"]
N --> DevLog["Development Logger"]
P --> Listen["Server Port Binding"]
DBURI --> DBConn["Database Connection"]
```

**Diagram sources**
- [index.js:1-119](file://backend/index.js#L1-L119)
- [db.js:9-13](file://backend/db/db.js#L9-L13)
- [jwt.js:13-19](file://backend/utils/jwt.js#L13-L19)

**Section sources**
- [index.js:1-119](file://backend/index.js#L1-L119)
- [db.js:9-13](file://backend/db/db.js#L9-L13)
- [jwt.js:13-19](file://backend/utils/jwt.js#L13-L19)
- [package.json:6-10](file://backend/package.json#L6-L10)

### Request Logging for Development
- A simple middleware logs method and URL with ISO timestamp during development.
- Disabled in non-development environments.

```mermaid
flowchart TD
Check["NODE_ENV == development?"] --> |Yes| Log["Log request: method + url + timestamp"]
Check --> |No| Skip["Skip logging"]
Log --> Next["Call next()"]
Skip --> Next
```

**Diagram sources**
- [index.js:32-38](file://backend/index.js#L32-L38)

**Section sources**
- [index.js:32-38](file://backend/index.js#L32-L38)

### Health Check Endpoint
- GET /health responds with success flag, message, timestamp, and environment.
- Useful for load balancers and container orchestrators.

```mermaid
sequenceDiagram
participant Client as "Client"
participant App as "Express App"
participant Resp as "Response"
Client->>App : GET /health
App->>Resp : 200 JSON {success,message,timestamp,environment}
Resp-->>Client : Health status
```

**Diagram sources**
- [index.js:40-48](file://backend/index.js#L40-L48)

**Section sources**
- [index.js:40-48](file://backend/index.js#L40-L48)

### Error Handling Mechanisms
- Centralized error handler translates various error types (CastError, duplicate key, validation, JWT errors) into structured ApiError instances.
- Development mode returns full error details; production returns sanitized messages.
- 404 handler marks unmatched routes as errors.
- ApiError captures status code, operational flag, and error classification.

```mermaid
flowchart TD
Req["Incoming Request"] --> Validate["Validation Middleware"]
Validate --> |Errors| VErr["ApiError(400)"]
Validate --> |OK| Auth["Auth Middleware"]
Auth --> |Errors| AErr["ApiError(401/403)"]
Auth --> |OK| Controller["Controller Logic"]
Controller --> |Throw| Throw["Throw ApiError"]
Controller --> |Async Error| Async["Unhandled Promise Rejection"]
Throw --> EH["Global Error Handler"]
VErr --> EH
AErr --> EH
Async --> EH
EH --> Dev{"NODE_ENV == development?"}
Dev --> |Yes| DevResp["Send {error,message,stack}"]
Dev --> |No| ProdResp["Send {message,errors?}"]
EH --> NotFound["404 Not Found"]
```

**Diagram sources**
- [error.js:84-103](file://backend/middleware/error.js#L84-L103)
- [error.js:109-115](file://backend/middleware/error.js#L109-L115)
- [ApiError.js:5-18](file://backend/utils/ApiError.js#L5-L18)
- [validate.js:12-25](file://backend/middleware/validate.js#L12-L25)
- [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)

**Section sources**
- [error.js:84-103](file://backend/middleware/error.js#L84-L103)
- [error.js:109-115](file://backend/middleware/error.js#L109-L115)
- [ApiError.js:5-18](file://backend/utils/ApiError.js#L5-L18)
- [validate.js:12-25](file://backend/middleware/validate.js#L12-L25)
- [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)

### Graceful Shutdown and Unhandled Exceptions
- Unhandled promise rejections trigger server close and process exit.
- Uncaught exceptions log and exit immediately.
- SIGTERM triggers graceful shutdown by closing the server.

```mermaid
sequenceDiagram
participant Proc as "Process"
participant App as "Express App"
participant Server as "HTTP Server"
Proc->>App : unhandledRejection(err)
App->>Server : close()
Server-->>App : closed
App->>Proc : exit(1)
Proc->>App : uncaughtException(err)
App->>Proc : exit(1)
Proc->>App : SIGTERM
App->>Server : close()
Server-->>App : terminated
```

**Diagram sources**
- [index.js:94-116](file://backend/index.js#L94-L116)

**Section sources**
- [index.js:94-116](file://backend/index.js#L94-L116)

### Route Modules and Middleware Integration
- Routes define endpoints grouped by domain (auth, products, orders).
- Each route integrates validation and authentication middleware.
- Controllers receive validated and authenticated requests via async handlers.

```mermaid
graph LR
VR["validate.authValidation"] --> AR["authRoutes"]
PR["validate.productValidation"] --> PRr["productRoutes"]
ORv["validate.orderValidation"] --> ORr["orderRoutes"]
AR --> AC["auth.authenticate"]
PRr --> AC
ORr --> AC
AR --> AH["asyncHandler"]
PRr --> AH
ORr --> AH
```

**Diagram sources**
- [authRoutes.js:17-20](file://backend/routes/authRoutes.js#L17-L20)
- [productRoutes.js:19-21](file://backend/routes/productRoutes.js#L19-L21)
- [orderRoutes.js:16-18](file://backend/routes/orderRoutes.js#L16-L18)
- [validate.js:30-67](file://backend/middleware/validate.js#L30-L67)
- [auth.js:95-110](file://backend/middleware/auth.js#L95-L110)
- [asyncHandler.js:9-13](file://backend/utils/asyncHandler.js#L9-L13)

**Section sources**
- [authRoutes.js:1-85](file://backend/routes/authRoutes.js#L1-L85)
- [productRoutes.js:1-101](file://backend/routes/productRoutes.js#L1-L101)
- [orderRoutes.js:1-77](file://backend/routes/orderRoutes.js#L1-L77)
- [validate.js:1-221](file://backend/middleware/validate.js#L1-L221)
- [auth.js:1-124](file://backend/middleware/auth.js#L1-L124)
- [asyncHandler.js:1-16](file://backend/utils/asyncHandler.js#L1-L16)

### Security Headers and Production Hardening
- Current implementation does not apply explicit security headers.
- Recommended additions for production:
  - helmet for default secure headers
  - rate-limit for API throttling
  - hpp for HTTP parameter pollution
  - xssFilters for XSS protection
  - enforce HTTPS in production environments
  - restrict CORS origin to exact domains in production

[No sources needed since this section provides general guidance]

### Performance Optimizations
- Body parser size limits configured to accommodate larger payloads.
- Centralized async error handling reduces boilerplate and improves error propagation.
- Standardized response utilities ensure consistent payloads.
- Validation middleware aggregates and normalizes validation errors.

**Section sources**
- [index.js:20-21](file://backend/index.js#L20-L21)
- [asyncHandler.js:9-13](file://backend/utils/asyncHandler.js#L9-L13)
- [ApiResponse.js:14-46](file://backend/utils/ApiResponse.js#L14-L46)
- [validate.js:12-25](file://backend/middleware/validate.js#L12-L25)

## Dependency Analysis
- Express app depends on dotenv, cors, and Mongoose.
- Routes depend on controllers and middleware modules.
- Middleware depends on validation utilities and JWT helpers.
- Utilities depend on core libraries (jsonwebtoken, express-validator).

```mermaid
graph TB
App["index.js"] --> Dot["dotenv"]
App --> Cor["cors"]
App --> DB["db.js"]
App --> Err["middleware/error.js"]
App --> AR["routes/authRoutes.js"]
App --> PR["routes/productRoutes.js"]
App --> OR["routes/orderRoutes.js"]
AR --> AV["middleware/validate.js"]
PR --> PV["middleware/validate.js"]
OR --> OV["middleware/validate.js"]
AR --> AM["middleware/auth.js"]
PR --> AM
OR --> AM
AM --> JWT["utils/jwt.js"]
Err --> AE["utils/ApiError.js"]
AR --> AS["utils/ApiResponse.js"]
PR --> AS
OR --> AS
AR --> AH["utils/asyncHandler.js"]
PR --> AH
OR --> AH
```

**Diagram sources**
- [index.js:1-119](file://backend/index.js#L1-L119)
- [authRoutes.js:1-85](file://backend/routes/authRoutes.js#L1-L85)
- [productRoutes.js:1-101](file://backend/routes/productRoutes.js#L1-L101)
- [orderRoutes.js:1-77](file://backend/routes/orderRoutes.js#L1-L77)
- [validate.js:1-221](file://backend/middleware/validate.js#L1-L221)
- [auth.js:1-124](file://backend/middleware/auth.js#L1-L124)
- [jwt.js:1-49](file://backend/utils/jwt.js#L1-L49)
- [error.js:1-121](file://backend/middleware/error.js#L1-L121)
- [ApiError.js:1-21](file://backend/utils/ApiError.js#L1-L21)
- [ApiResponse.js:1-52](file://backend/utils/ApiResponse.js#L1-L52)
- [asyncHandler.js:1-16](file://backend/utils/asyncHandler.js#L1-L16)

**Section sources**
- [index.js:1-119](file://backend/index.js#L1-L119)
- [package.json:20-28](file://backend/package.json#L20-L28)

## Performance Considerations
- Keep body parser limits appropriate for your workload; avoid overly large limits to prevent memory pressure.
- Use asyncHandler consistently to prevent unhandled promise rejections from impacting performance.
- Centralize error handling to reduce branching overhead in routes.
- Consider adding compression middleware for production traffic reduction.
- Monitor database connection pool sizing and timeouts.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Database connection failures: Check MONGODB_URI and network connectivity; the connection routine exits the process on failure.
- CORS errors: Verify CLIENT_URL matches the frontend origin; ensure credentials are supported if cookies are used.
- Validation errors: Review validation rules and ensure request payloads match expected schemas.
- Authentication failures: Confirm JWT_SECRET is set and tokens are not expired.
- Unhandled rejections: Inspect logs for unhandledRejection events; ensure all async paths use asyncHandler or proper error propagation.
- SIGTERM handling: Confirm process manager sends SIGTERM and that server.close completes gracefully.

**Section sources**
- [db.js:17-20](file://backend/db/db.js#L17-L20)
- [index.js:23-30](file://backend/index.js#L23-L30)
- [validate.js:12-25](file://backend/middleware/validate.js#L12-L25)
- [jwt.js:27-29](file://backend/utils/jwt.js#L27-L29)
- [index.js:94-116](file://backend/index.js#L94-L116)

## Conclusion
The server is configured with a clear middleware pipeline, centralized error handling, and lifecycle hooks for robust operation. CORS, body parsing, and development logging are environment-aware. The modular route and middleware structure supports maintainability. For production, add security headers, rate limiting, and monitoring to enhance resilience and compliance.

## Appendices

### Environment Configuration Examples
- Development (.env):
  - NODE_ENV=development
  - PORT=5000
  - MONGODB_URI=mongodb://localhost:27017/ecommerce_dev
  - CLIENT_URL=http://localhost:3000
  - JWT_SECRET=your_jwt_secret_key
  - JWT_EXPIRE=7d
- Production (.env.production):
  - NODE_ENV=production
  - PORT=8000
  - MONGODB_URI=your_atlas_uri
  - CLIENT_URL=https://yourdomain.com
  - JWT_SECRET=your_production_secret
  - JWT_EXPIRE=7d

[No sources needed since this section provides general guidance]

### Server Startup Patterns
- Development: npm run dev (nodemon watches for changes)
- Production: npm start (node index.js)

**Section sources**
- [package.json:6-10](file://backend/package.json#L6-L10)