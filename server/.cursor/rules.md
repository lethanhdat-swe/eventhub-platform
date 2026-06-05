Project: EventHub - Event Ticket Booking System

Architecture Rules:

- routes: define endpoints only
- controllers: handle request and response only
- services: contain all business logic
- prisma: handle all database operations

- Never put business logic inside controllers
- Never access database directly in controllers
- Controllers must only call services and return responses
- Services must not depend on Express request/response objects

Error Handling Rules:

- All errors must be thrown from services
- Do not use try/catch in services unless necessary
- Controllers should not handle business errors
- Use centralized error middleware to handle all errors
- Always use the custom `AppError` class to throw errors (e.g., `throw new AppError("message", status)`). Do NOT throw raw `Error` objects or manually attach a `status` property to them.

API Response Rules:

- Do not use res.json directly
- Always use standardized response helpers

Success response:
res.success({
message: string,
data?: any,
status?: number
})

Error response:
res.error({
message: string,
error?: any,
status?: number
})

Coding Rules:

- Use camelCase for variables and functions
- Use PascalCase for classes, models, and types
- Use async/await only (no callbacks)
- Avoid using "any" unless absolutely necessary
- Write clean, readable, and maintainable code (prefer clarity over brevity)

Class Structure Rules:

- Controllers and Services must be implemented as classes
- Do not use plain functions for controllers or services
- Each controller should be a class with methods
- Each service should be a class with methods

- Controller methods handle request and response only
- Service methods contain business logic only

- Use "this" to access service methods inside class
- Do not export raw functions for business logic

Instantiation Rules:

- Services should be instantiated once and reused
- Controllers should receive service instances via constructor

Listing & Pagination Rules

- Pagination: Always use Offset-based (skip, take).

- Standard Meta: Response must include totalItems, itemCount, itemsPerPage, totalPages, currentPage.

- Performance: Always use Promise.all for findMany and count to optimize latency.

- Search: Use OR with contains for string fields. No mode: 'insensitive' for MySQL.

- Data Minimization: Always use select. Never return unnecessary fields or sensitive data.

- Ordering: Default to createdAt: "desc".

- Validation: Query params must be validated and transformed (string to number) via Zod before reaching Service.

- Total isolation: Services must only receive clean, parsed numbers/strings, never the raw req.query object.

Authentication Rules:

- Always hash password using bcrypt
- Never store plain text passwords
- Email must be unique
- Implement email verification flow
- Do not allow login if email is not verified
- Use JWT for authentication
- Protect private routes using `isAuth` middleware
- Use `restrictTo(...roles: string[])` for Role-Based Access Control (RBAC) after `isAuth`
- User roles supported: `user`, `admin`
- Authenticated user information is attached to `req.user`

Validation Rules:

- All request validation must be handled by dedicated middleware using Zod
- Controllers must NEVER perform input validation
- Each endpoint that accepts input (body, params, query) must have a corresponding Zod schema
- Zod schemas must be stored in /schemas directory and follow feature-based structure

- Validation middleware must run BEFORE controller execution
- If validation fails, middleware must throw an error and stop request flow
- Validation errors must be handled by centralized error middleware

- Controllers must assume all incoming data is already validated and sanitized
- Services must never depend on raw or unvalidated request data

- Reusable validate middleware must accept a Zod schema and validate:
    - req.body
    - req.params
    - req.query

Data Flow Rule (Updated):

Request → Validation Middleware → Auth Middleware → Controller → Service → Prisma

Database Rules:

- Use Prisma for all database operations
- Do not write raw SQL unless absolutely necessary
- Use proper relations defined in Prisma schema
- Keep database naming in snake_case using Prisma @map

Naming Convention:

- Code: camelCase
- Database: snake_case via Prisma mapping

Project Context:

- Users can register, login, and verify email
- Users can browse events and book tickets
- Users can select seats and receive QR tickets
- Admin can manage events, users, and orders

Message Language Rules:

- API Response messages (res.success / res.error returned to FE) must always be in English
    - These messages are used for frontend display, logging, and system communication
    - Must be clear, short, and professional English

- Email / Notification content sent directly to users (e.g. Gmail, OTP, verification email, system notifications) must be written in Vietnamese
    - These messages are user-facing and should follow local user language (Vietnamese)
    - Must be friendly, natural, and easy to understand

- Do NOT mix languages within the same message type
- Always separate system communication (English) and user communication (Vietnamese)
