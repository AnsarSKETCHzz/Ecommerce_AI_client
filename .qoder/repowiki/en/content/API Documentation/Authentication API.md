# Authentication API

<cite>
**Referenced Files in This Document**
- [authController.js](file://backend/controllers/authController.js)
- [authRoutes.js](file://backend/routes/authRoutes.js)
- [auth.js](file://backend/middleware/auth.js)
- [validate.js](file://backend/middleware/validate.js)
- [jwt.js](file://backend/utils/jwt.js)
- [User.js](file://backend/models/User.js)
- [ApiError.js](file://backend/utils/ApiError.js)
- [ApiResponse.js](file://backend/utils/ApiResponse.js)
- [error.js](file://backend/middleware/error.js)
- [index.js](file://backend/index.js)
- [package.json](file://backend/package.json)
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
This document provides comprehensive API documentation for the authentication endpoints. It covers user registration, login, profile management, password change, address management, and logout. For each endpoint, you will find HTTP methods, URL patterns, request/response schemas, authentication requirements (Bearer tokens), validation rules, error handling, and security considerations. Practical examples with curl commands and code snippet paths demonstrate typical authentication workflows. JWT token generation, expiration, and refresh mechanisms are documented, along with role-based access control and admin privileges.

## Project Structure
The authentication module follows an MVC architecture with clear separation of concerns:
- Routes define endpoint URLs and HTTP methods
- Controllers implement business logic and orchestrate data flow
- Middleware handles authentication, validation, and error handling
- Utilities provide JWT helpers and standardized responses
- Models define the User schema and methods

```mermaid
graph TB
subgraph "Backend"
R["Routes<br/>authRoutes.js"]
C["Controllers<br/>authController.js"]
M1["Middleware<br/>auth.js"]
M2["Validation<br/>validate.js"]
U1["Utils<br/>jwt.js"]
U2["Utils<br/>ApiResponse.js"]
U3["Utils<br/>ApiError.js"]
MD["Models<br/>User.js"]
E["Error Handler<br/>error.js"]
end
R --> C
C --> MD
C --> U1
C --> U2
R --> M1
R --> M2
M1 --> MD
M1 --> U1
E --> U3
```

**Diagram sources**
- [authRoutes.js:1-85](file://backend/routes/authRoutes.js#L1-L85)
- [authController.js:1-299](file://backend/controllers/authController.js#L1-L299)
- [auth.js:1-124](file://backend/middleware/auth.js#L1-L124)
- [validate.js:1-221](file://backend/middleware/validate.js#L1-L221)
- [jwt.js:1-49](file://backend/utils/jwt.js#L1-L49)
- [ApiResponse.js:1-52](file://backend/utils/ApiResponse.js#L1-L52)
- [ApiError.js:1-21](file://backend/utils/ApiError.js#L1-L21)
- [User.js:1-135](file://backend/models/User.js#L1-L135)
- [error.js:1-121](file://backend/middleware/error.js#L1-L121)

**Section sources**
- [authRoutes.js:1-85](file://backend/routes/authRoutes.js#L1-L85)
- [authController.js:1-299](file://backend/controllers/authController.js#L1-L299)
- [auth.js:1-124](file://backend/middleware/auth.js#L1-L124)
- [validate.js:1-221](file://backend/middleware/validate.js#L1-L221)
- [jwt.js:1-49](file://backend/utils/jwt.js#L1-L49)
- [ApiResponse.js:1-52](file://backend/utils/ApiResponse.js#L1-L52)
- [ApiError.js:1-21](file://backend/utils/ApiError.js#L1-L21)
- [User.js:1-135](file://backend/models/User.js#L1-L135)
- [error.js:1-121](file://backend/middleware/error.js#L1-L121)

## Core Components
- Authentication middleware verifies Bearer tokens and attaches user context
- Validation middleware enforces request parameter rules using express-validator
- JWT utilities generate and verify tokens with configurable expiration
- User model defines schema, password hashing, and public profile serialization
- Standardized response and error utilities ensure consistent API behavior

**Section sources**
- [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)
- [validate.js:12-25](file://backend/middleware/validate.js#L12-L25)
- [jwt.js:13-29](file://backend/utils/jwt.js#L13-L29)
- [User.js:8-72](file://backend/models/User.js#L8-L72)
- [ApiResponse.js:14-26](file://backend/utils/ApiResponse.js#L14-L26)
- [ApiError.js:5-18](file://backend/utils/ApiError.js#L5-L18)

## Architecture Overview
The authentication flow integrates route handlers, middleware, controllers, and utilities:

```mermaid
sequenceDiagram
participant Client as "Client"
participant Router as "authRoutes.js"
participant AuthMW as "auth.js authenticate"
participant Ctrl as "authController.js"
participant Model as "User.js"
participant JWT as "jwt.js"
participant Resp as "ApiResponse.js"
Client->>Router : "HTTP Request"
Router->>AuthMW : "authenticate()"
AuthMW->>JWT : "verifyToken()"
JWT-->>AuthMW : "decoded payload"
AuthMW->>Model : "find user by ID"
Model-->>AuthMW : "user object"
AuthMW-->>Router : "attach req.user"
Router->>Ctrl : "call controller action"
Ctrl->>Model : "read/write data"
Ctrl->>JWT : "generateToken() (on register/login)"
JWT-->>Ctrl : "JWT token"
Ctrl->>Resp : "successResponse()"
Resp-->>Client : "JSON response"
```

**Diagram sources**
- [authRoutes.js:17-82](file://backend/routes/authRoutes.js#L17-L82)
- [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)
- [authController.js:17-94](file://backend/controllers/authController.js#L17-L94)
- [User.js:118-130](file://backend/models/User.js#L118-L130)
- [jwt.js:13-29](file://backend/utils/jwt.js#L13-L29)
- [ApiResponse.js:14-26](file://backend/utils/ApiResponse.js#L14-L26)

## Detailed Component Analysis

### Endpoint: POST /api/auth/register
- Method: POST
- URL: /api/auth/register
- Access: Public
- Purpose: Register a new user
- Authentication: None
- Request Body:
  - name: string, required, length 2-50, trimmed
  - email: string, required, valid email format, normalized
  - password: string, required, minimum 8 characters, must contain uppercase, lowercase, and digit
- Response:
  - user: object (public profile without sensitive fields)
  - token: string (JWT)
- Validation:
  - Uses express-validator rules for name, email, password
- Security:
  - Password hashed via bcrypt before save
  - Unique email constraint enforced by database
- Error Handling:
  - 400: Validation failure with field-level messages
  - 409: Email already exists
  - 500: Internal server error
- Example curl:
  - curl -X POST https://your-api.com/api/auth/register -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password":"SecurePass123"}'
- Implementation Reference:
  - [authController.js:17-47](file://backend/controllers/authController.js#L17-L47)
  - [validate.js:30-67](file://backend/middleware/validate.js#L30-L67)
  - [User.js:92-103](file://backend/models/User.js#L92-L103)

**Section sources**
- [authController.js:17-47](file://backend/controllers/authController.js#L17-L47)
- [validate.js:30-67](file://backend/middleware/validate.js#L30-L67)
- [User.js:92-103](file://backend/models/User.js#L92-L103)

### Endpoint: POST /api/auth/login
- Method: POST
- URL: /api/auth/login
- Access: Public
- Purpose: Authenticate user and issue JWT
- Authentication: None
- Request Body:
  - email: string, required, valid email
  - password: string, required
- Response:
  - user: object (public profile)
  - token: string (JWT)
- Validation:
  - Uses express-validator rules for email and password
- Security:
  - Password comparison via bcrypt
  - Account deactivation check
  - Last login timestamp update
- Error Handling:
  - 400: Validation failure
  - 401: Invalid credentials or deactivated account
  - 404: User not found
  - 500: Internal server error
- Example curl:
  - curl -X POST https://your-api.com/api/auth/login -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"SecurePass123"}'
- Implementation Reference:
  - [authController.js:54-94](file://backend/controllers/authController.js#L54-L94)
  - [validate.js:55-66](file://backend/middleware/validate.js#L55-L66)
  - [User.js:110-112](file://backend/models/User.js#L110-L112)

**Section sources**
- [authController.js:54-94](file://backend/controllers/authController.js#L54-L94)
- [validate.js:55-66](file://backend/middleware/validate.js#L55-L66)
- [User.js:110-112](file://backend/models/User.js#L110-L112)

### Endpoint: GET /api/auth/profile
- Method: GET
- URL: /api/auth/profile
- Access: Private (requires Bearer token)
- Purpose: Retrieve current user profile
- Authentication: Required
- Request Headers:
  - Authorization: Bearer <token>
- Response:
  - user: object (public profile)
- Error Handling:
  - 401: Missing/invalid/expired token, user not found, user deactivated
  - 404: User not found
  - 500: Internal server error
- Example curl:
  - curl -X GET https://your-api.com/api/auth/profile -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
- Implementation Reference:
  - [authRoutes.js:35-40](file://backend/routes/authRoutes.js#L35-L40)
  - [authController.js:101-111](file://backend/controllers/authController.js#L101-L111)
  - [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)

**Section sources**
- [authRoutes.js:35-40](file://backend/routes/authRoutes.js#L35-L40)
- [authController.js:101-111](file://backend/controllers/authController.js#L101-L111)
- [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)

### Endpoint: PUT /api/auth/profile
- Method: PUT
- URL: /api/auth/profile
- Access: Private
- Purpose: Update user profile fields
- Authentication: Required
- Request Body:
  - name: string, optional
  - phone: string, optional
  - avatar: string, optional
- Response:
  - user: object (updated public profile)
- Error Handling:
  - 401: Missing/invalid/expired token, user not found, user deactivated
  - 404: User not found
  - 500: Internal server error
- Example curl:
  - curl -X PUT https://your-api.com/api/auth/profile -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"phone":"+1234567890","avatar":"https://example.com/avatar.jpg"}'
- Implementation Reference:
  - [authRoutes.js:42-47](file://backend/routes/authRoutes.js#L42-L47)
  - [authController.js:118-137](file://backend/controllers/authController.js#L118-L137)
  - [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)

**Section sources**
- [authRoutes.js:42-47](file://backend/routes/authRoutes.js#L42-L47)
- [authController.js:118-137](file://backend/controllers/authController.js#L118-L137)
- [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)

### Endpoint: PUT /api/auth/change-password
- Method: PUT
- URL: /api/auth/change-password
- Access: Private
- Purpose: Change user password
- Authentication: Required
- Request Body:
  - currentPassword: string, required
  - newPassword: string, required
- Response:
  - message: string
- Error Handling:
  - 401: Missing/invalid/expired token, user not found, invalid current password
  - 404: User not found
  - 500: Internal server error
- Example curl:
  - curl -X PUT https://your-api.com/api/auth/change-password -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"currentPassword":"OldPass123","newPassword":"NewPass456"}'
- Implementation Reference:
  - [authRoutes.js:49-54](file://backend/routes/authRoutes.js#L49-L54)
  - [authController.js:144-165](file://backend/controllers/authController.js#L144-L165)
  - [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)

**Section sources**
- [authRoutes.js:49-54](file://backend/routes/authRoutes.js#L49-L54)
- [authController.js:144-165](file://backend/controllers/authController.js#L144-L165)
- [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)

### Endpoint: POST /api/auth/addresses
- Method: POST
- URL: /api/auth/addresses
- Access: Private
- Purpose: Add a new address to user profile
- Authentication: Required
- Request Body:
  - street: string, required
  - city: string, required
  - state: string, required
  - zipCode: string, required
  - country: string, optional, default "India"
  - isDefault: boolean, optional, default false
- Response:
  - addresses: array (updated address list)
- Behavior:
  - If isDefault is true, clears default flag from other addresses
- Error Handling:
  - 401: Missing/invalid/expired token, user not found, user deactivated
  - 404: User not found
  - 500: Internal server error
- Example curl:
  - curl -X POST https://your-api.com/api/auth/addresses -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"street":"123 Main St","city":"Anytown","state":"ST","zipCode":"12345","country":"USA","isDefault":true}'
- Implementation Reference:
  - [authRoutes.js:56-61](file://backend/routes/authRoutes.js#L56-L61)
  - [authController.js:172-203](file://backend/controllers/authController.js#L172-L203)
  - [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)

**Section sources**
- [authRoutes.js:56-61](file://backend/routes/authRoutes.js#L56-L61)
- [authController.js:172-203](file://backend/controllers/authController.js#L172-L203)
- [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)

### Endpoint: PUT /api/auth/addresses/:addressId
- Method: PUT
- URL: /api/auth/addresses/:addressId
- Access: Private
- Purpose: Update an existing address
- Authentication: Required
- Path Parameters:
  - addressId: string, required (MongoDB ObjectId)
- Request Body:
  - street: string, optional
  - city: string, optional
  - state: string, optional
  - zipCode: string, optional
  - country: string, optional
  - isDefault: boolean, optional
- Response:
  - addresses: array (updated address list)
- Behavior:
  - If isDefault is true, clears default flag from other addresses
- Error Handling:
  - 401: Missing/invalid/expired token, user not found, user deactivated
  - 404: User not found, address not found
  - 500: Internal server error
- Example curl:
  - curl -X PUT https://your-api.com/api/auth/addresses/507f1f77bcf86cd799439011 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"isDefault":false}'
- Implementation Reference:
  - [authRoutes.js:63-68](file://backend/routes/authRoutes.js#L63-L68)
  - [authController.js:210-246](file://backend/controllers/authController.js#L210-L246)
  - [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)

**Section sources**
- [authRoutes.js:63-68](file://backend/routes/authRoutes.js#L63-L68)
- [authController.js:210-246](file://backend/controllers/authController.js#L210-L246)
- [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)

### Endpoint: DELETE /api/auth/addresses/:addressId
- Method: DELETE
- URL: /api/auth/addresses/:addressId
- Access: Private
- Purpose: Remove an address from user profile
- Authentication: Required
- Path Parameters:
  - addressId: string, required (MongoDB ObjectId)
- Response:
  - addresses: array (updated address list)
- Error Handling:
  - 401: Missing/invalid/expired token, user not found, user deactivated
  - 404: User not found, address not found
  - 500: Internal server error
- Example curl:
  - curl -X DELETE https://your-api.com/api/auth/addresses/507f1f77bcf86cd799439011 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
- Implementation Reference:
  - [authRoutes.js:70-75](file://backend/routes/authRoutes.js#L70-L75)
  - [authController.js:253-275](file://backend/controllers/authController.js#L253-L275)
  - [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)

**Section sources**
- [authRoutes.js:70-75](file://backend/routes/authRoutes.js#L70-L75)
- [authController.js:253-275](file://backend/controllers/authController.js#L253-L275)
- [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)

### Endpoint: POST /api/auth/logout
- Method: POST
- URL: /api/auth/logout
- Access: Private
- Purpose: Client-side token removal indicator
- Authentication: Required
- Notes:
  - Since JWT is stateless, logout is handled client-side
  - This endpoint can be extended for logging or token blacklisting
- Response:
  - message: string
- Error Handling:
  - 401: Missing/invalid/expired token, user not found, user deactivated
  - 500: Internal server error
- Example curl:
  - curl -X POST https://your-api.com/api/auth/logout -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
- Implementation Reference:
  - [authRoutes.js:77-82](file://backend/routes/authRoutes.js#L77-L82)
  - [authController.js:282-286](file://backend/controllers/authController.js#L282-L286)
  - [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)

**Section sources**
- [authRoutes.js:77-82](file://backend/routes/authRoutes.js#L77-L82)
- [authController.js:282-286](file://backend/controllers/authController.js#L282-L286)
- [auth.js:10-55](file://backend/middleware/auth.js#L10-L55)

## Dependency Analysis
The authentication endpoints depend on middleware, utilities, and models as shown below:

```mermaid
graph LR
AuthRoutes["authRoutes.js"] --> AuthMW["auth.js"]
AuthRoutes --> ValidateMW["validate.js"]
AuthRoutes --> AuthController["authController.js"]
AuthController --> UserModel["User.js"]
AuthController --> JWTUtil["jwt.js"]
AuthController --> SuccessResp["ApiResponse.js"]
AuthMW --> UserModel
AuthMW --> JWTUtil
AuthMW --> ApiError["ApiError.js"]
ErrorHandler["error.js"] --> ApiError
```

**Diagram sources**
- [authRoutes.js:1-85](file://backend/routes/authRoutes.js#L1-L85)
- [auth.js:1-124](file://backend/middleware/auth.js#L1-L124)
- [validate.js:1-221](file://backend/middleware/validate.js#L1-L221)
- [authController.js:1-299](file://backend/controllers/authController.js#L1-L299)
- [User.js:1-135](file://backend/models/User.js#L1-L135)
- [jwt.js:1-49](file://backend/utils/jwt.js#L1-L49)
- [ApiResponse.js:1-52](file://backend/utils/ApiResponse.js#L1-L52)
- [ApiError.js:1-21](file://backend/utils/ApiError.js#L1-L21)
- [error.js:1-121](file://backend/middleware/error.js#L1-L121)

**Section sources**
- [authRoutes.js:1-85](file://backend/routes/authRoutes.js#L1-L85)
- [auth.js:1-124](file://backend/middleware/auth.js#L1-L124)
- [validate.js:1-221](file://backend/middleware/validate.js#L1-L221)
- [authController.js:1-299](file://backend/controllers/authController.js#L1-L299)
- [User.js:1-135](file://backend/models/User.js#L1-L135)
- [jwt.js:1-49](file://backend/utils/jwt.js#L1-L49)
- [ApiResponse.js:1-52](file://backend/utils/ApiResponse.js#L1-L52)
- [ApiError.js:1-21](file://backend/utils/ApiError.js#L1-L21)
- [error.js:1-121](file://backend/middleware/error.js#L1-L121)

## Performance Considerations
- Token verification is lightweight; ensure JWT_SECRET is strong and environment variables are configured securely.
- Password hashing uses bcrypt with 12 rounds; acceptable for production but consider monitoring CPU usage under load.
- Address operations iterate over user.addresses; keep address lists reasonably sized to avoid performance degradation.
- Validation middleware short-circuits on first error, reducing unnecessary processing.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- Missing Authorization Header:
  - Symptom: 401 Access denied. No token provided.
  - Resolution: Include Authorization: Bearer <token> header.
- Invalid or Expired Token:
  - Symptom: 401 Invalid token or Token expired.
  - Resolution: Re-authenticate to obtain a new token.
- User Deactivated:
  - Symptom: 401 User account is deactivated.
  - Resolution: Contact administrator to reactivate account.
- Validation Failures:
  - Symptom: 400 Validation failed with field-level messages.
  - Resolution: Correct input according to validation rules.
- Duplicate Email:
  - Symptom: 409 Email already exists.
  - Resolution: Use a different email address.
- Address Not Found:
  - Symptom: 404 Address not found.
  - Resolution: Ensure addressId is valid and belongs to the authenticated user.

**Section sources**
- [auth.js:22-54](file://backend/middleware/auth.js#L22-L54)
- [error.js:84-103](file://backend/middleware/error.js#L84-L103)
- [validate.js:12-25](file://backend/middleware/validate.js#L12-L25)

## Conclusion
The authentication API provides secure, standardized endpoints for user lifecycle management. It leverages JWT for stateless authentication, express-validator for robust input validation, and consistent response/error utilities. Role-based access control is supported through dedicated middleware, enabling admin-only operations. The documented workflows and examples facilitate quick integration and reliable operation.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices

### JWT Token Generation, Expiration, and Refresh
- Token Generation:
  - Payload includes userId, email, and role
  - Secret and expiration configured via environment variables
- Expiration:
  - Access tokens expire after 7 days by default
- Refresh Mechanism:
  - A separate refresh token generator is available for long-lived sessions
- Security:
  - Tokens are verified centrally; invalid/expired tokens return 401
- References:
  - [jwt.js:13-29](file://backend/utils/jwt.js#L13-L29)
  - [jwt.js:36-42](file://backend/utils/jwt.js#L36-L42)
  - [auth.js:26-54](file://backend/middleware/auth.js#L26-L54)

**Section sources**
- [jwt.js:13-29](file://backend/utils/jwt.js#L13-L29)
- [jwt.js:36-42](file://backend/utils/jwt.js#L36-L42)
- [auth.js:26-54](file://backend/middleware/auth.js#L26-L54)

### Role-Based Access Control and Admin Privileges
- Authentication Middleware:
  - authenticate: requires valid token and active user
  - optionalAuth: attaches user if present and valid, otherwise continues
- Authorization Middleware:
  - authorize(...roles): restricts access to specified roles
  - adminOnly: shortcut for authorize('admin')
- Usage:
  - Apply authorize('admin') to admin-only endpoints
- References:
  - [auth.js:95-116](file://backend/middleware/auth.js#L95-L116)

**Section sources**
- [auth.js:95-116](file://backend/middleware/auth.js#L95-L116)

### Request/Response Schemas

#### Register Request
- name: string, required
- email: string, required
- password: string, required

#### Login Request
- email: string, required
- password: string, required

#### Profile Update Request
- name: string, optional
- phone: string, optional
- avatar: string, optional

#### Change Password Request
- currentPassword: string, required
- newPassword: string, required

#### Add Address Request
- street: string, required
- city: string, required
- state: string, required
- zipCode: string, required
- country: string, optional, default "India"
- isDefault: boolean, optional, default false

#### Update Address Request
- street: string, optional
- city: string, optional
- state: string, optional
- zipCode: string, optional
- country: string, optional
- isDefault: boolean, optional

**Section sources**
- [validate.js:30-67](file://backend/middleware/validate.js#L30-L67)
- [authController.js:118-137](file://backend/controllers/authController.js#L118-L137)
- [authController.js:144-165](file://backend/controllers/authController.js#L144-L165)
- [authController.js:172-203](file://backend/controllers/authController.js#L172-L203)
- [authController.js:210-246](file://backend/controllers/authController.js#L210-L246)

### Error Handling Flow
```mermaid
flowchart TD
Start(["Error Occurs"]) --> CheckType{"Error Type"}
CheckType --> |Validation| HandleVal["handleValidationErrors"]
CheckType --> |CastError| HandleCast["handleCastError"]
CheckType --> |Duplicate Key| HandleDup["handleDuplicateKeyError"]
CheckType --> |Mongoose Validation| HandleMVal["handleValidationError"]
CheckType --> |JWT Error| HandleJWT["handleJWTError / handleJWTExpiredError"]
CheckType --> |Other| DefaultErr["Default Error"]
HandleVal --> BuildResp["Build Error Response"]
HandleCast --> BuildResp
HandleDup --> BuildResp
HandleMVal --> BuildResp
HandleJWT --> BuildResp
DefaultErr --> BuildResp
BuildResp --> Env{"Environment"}
Env --> |Development| DevResp["Send Full Error Details"]
Env --> |Production| ProdResp["Send Minimal Error Details"]
DevResp --> End(["End"])
ProdResp --> End
```

**Diagram sources**
- [error.js:84-103](file://backend/middleware/error.js#L84-L103)
- [validate.js:12-25](file://backend/middleware/validate.js#L12-L25)

### Environment Variables
- JWT_SECRET: Secret key for signing JWT tokens
- JWT_EXPIRE: Access token expiration (default "7d")
- CLIENT_URL: Frontend origin for CORS
- NODE_ENV: Application environment (development/production)
- MONGODB_URI: MongoDB connection string

**Section sources**
- [jwt.js:16-18](file://backend/utils/jwt.js#L16-L18)
- [index.js:24-29](file://backend/index.js#L24-L29)
- [package.json:20-28](file://backend/package.json#L20-L28)