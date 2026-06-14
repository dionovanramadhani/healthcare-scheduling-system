# Healthcare Scheduling System

This repository contains a microservices-based Healthcare Scheduling System built using **NestJS**, **GraphQL (Code-First)**, **Prisma ORM**, and **PostgreSQL**. The project is containerized using **Docker** and **Docker Compose**.

---

## System Architecture

Below is a simple architectural diagram representing the connection between services, databases, and external APIs:

```mermaid
graph TD
    Client[GraphQL Clients / Playground]
    
    subgraph Auth Service Area
        AuthService[Auth Service :3001]
        AuthDB[(Auth DB :5454)]
    end

    subgraph Schedule Service Area
        ScheduleService[Schedule Service :3002]
        ScheduleDB[(Schedule DB :5455)]
        ResendAPI[Resend API]
    end

    Client -->|GraphQL Queries/Mutations| AuthService
    Client -->|GraphQL Queries/Mutations| ScheduleService
    
    AuthService -->|Prisma| AuthDB
    ScheduleService -->|Prisma| ScheduleDB
    
    ScheduleService -->|GraphQL POST /validateToken| AuthService
    ScheduleService -.->|Email Notification| ResendAPI
```

### Components:
1. **Auth Service**: Manages user registration, login, and JWT token validation. Runs on port `3001`.
2. **Schedule Service**: Handles scheduling operations (Customers, Doctors, and Schedules). Runs on port `3002`.
3. **PostgreSQL Databases**:
   - `auth-db` (Port `5454` external / `5432` internal) - Dedicated database for user credentials.
   - `schedule-db` (Port `5455` external / `5432` internal) - Dedicated database for doctor, customer, and schedule data.
4. **Resend API**: External mail service integrated into `Schedule Service` to notify customers when a schedule is created.

---

## Environment Variables

Configure these variables in `.env` files located inside their respective directories:

### Auth Service (`auth-service/.env`)
```env
# Database connection URL (change localhost to auth-db inside Docker Compose)
DATABASE_URL="postgresql://postgres:Y7vIfKlCqx@localhost:5454/auth_db?schema=public"

# HTTP Port of the service
PORT=3001
```

### Schedule Service (`schedule-service/.env`)
```env
# Database connection URL (change localhost to schedule-db inside Docker Compose)
DATABASE_URL="postgresql://postgres:Y7vIfKlCqx@localhost:5455/schedule_service_db?schema=public"

# Auth Service Endpoint for JWT validation
AUTH_SERVICE_URL="http://localhost:3001/"

# Public Key for guard metadata validation
PUBLIC_KEY="4kODVzGwdD"

# HTTP Port of the service
PORT=3002

# Resend Mail Service API Key
RESEND_API_KEY="your_resend_api_key_here"
```

---

## How to Run the Project

You can run the project using **Docker Compose** (fully containerized) or **Locally** (for development).

### Option 1: Running with Docker Compose (Recommended)
This spin up the entire system including databases, app services, and applies database migrations automatically.

1. Set the correct `RESEND_API_KEY` in `schedule-service/.env`.
2. Execute the following command from the root directory:
   ```bash
   docker compose up --build
   ```
3. Services will be accessible at:
   - **Auth Service GraphQL Playground**: `http://localhost:3001/`
   - **Schedule Service GraphQL Playground**: `http://localhost:3002/`

---

### Option 2: Running Locally (For Development)
For active development with hot-reload (`npm run start:dev`):

1. **Start only the Database containers:**
   ```bash
   docker compose up -d auth-db schedule-db
   ```
   *(Ensure database ports `5454` and `5455` are open).*

2. **Setup and run Auth Service:**
   ```bash
   cd auth-service
   npm install
   npx prisma db push
   npm run start:dev
   ```

3. **Setup and run Schedule Service:**
   ```bash
   cd ../schedule-service
   npm install
   npx prisma db push
   npm run start:dev
   ```

---

## GraphQL Examples

### 1. Auth Service (`http://localhost:3001`)

#### User Registration (Mutation)
```graphql
mutation RegisterUser {
  register(input: {
    email: "user@example.com",
    password: "password123"
  }) {
    id
    email
    createdAt
  }
}
```

#### User Login (Mutation)
```graphql
mutation LoginUser {
  login(input: {
    email: "user@example.com",
    password: "password123"
  }) {
    accessToken
    user {
      id
      email
    }
  }
}
```

---

### 2. Schedule Service (`http://localhost:3002`)

*Note: Except for Public queries, pass the JWT access token in the request headers: `Authorization: Bearer <your_access_token>`.*

#### Create Customer (Mutation)
```graphql
mutation CreateCustomer {
  createCustomer(input: {
    name: "John Doe",
    email: "johndoe@example.com"
  }) {
    id
    name
    email
  }
}
```

#### Create Doctor (Mutation)
```graphql
mutation CreateDoctor {
  createDoctor(input: {
    name: "Dr. Gregory House"
  }) {
    id
    name
  }
}
```

#### Create Schedule (Mutation)
*Note: Scheduled date must be in ISO String format.*
```graphql
mutation CreateSchedule {
  createSchedule(input: {
    customerId: "PASTE-CUSTOMER-UUID-HERE",
    doctorId: "PASTE-DOCTOR-UUID-HERE",
    objective: "Regular Heart checkup",
    scheduledAt: "2026-06-20T10:00:00.000Z"
  }) {
    id
    objective
    scheduledAt
    customer {
      name
      email
    }
    doctor {
      name
    }
  }
}
```

#### Get All Schedules with Pagination (Query)
```graphql
query GetSchedules {
  getAllSchedules(payload: {
    meta: {
      pageNumber: 1,
      pageSize: 10
    }
  }) {
    meta {
      totalCount
      totalPages
      currentPage
    }
    data {
      id
      objective
      scheduledAt
      customer {
        name
      }
      doctor {
        name
      }
    }
  }
}
```
