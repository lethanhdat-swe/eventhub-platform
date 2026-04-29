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

Authentication Rules:

- Always hash password using bcrypt
- Never store plain text passwords
- Email must be unique
- Implement email verification flow
- Do not allow login if email is not verified
- Use JWT for authentication
- Protect private routes using auth middleware

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
