# BhoomiGraph Backend

Node.js + Express + TypeScript + PostgreSQL (PostGIS) backend for BhoomiGraph.

## Prerequisites

1.  **Node.js** (v18+)
2.  **PostgreSQL** (v13+) with **PostGIS** extension enabled.
    ```sql
    CREATE EXTENSION postgis;
    ```
3.  **Redis** (Optional, for caching if needed in future)

## Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or if you encounter execution policy errors in PowerShell:
    cmd /c "npm install"
    ```

3.  Configure Environment Variables:
    -   Copy `.env.example` to `.env` (or use the one provided).
    -   Update `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` matching your local PostgreSQL setup.
    -   Update API Keys for Razorpay, Twilio, AWS S3.

4.  Build and Run:
    ```bash
    # Development
    npm run dev

    # Production Build
    npm run build
    npm start
    ```

## API Endpoints

-   **Auth**: `/api/auth` (Register, Login, OTP)
-   **Farms**: `/api/farms` (Create, List, Update - Supports GeoJSON)
-   **Drones**: `/api/drones` (Projects, Maps)
-   **Satellite**: `/api/satellite` (NDVI Records)
-   **IoT**: `/api/iot` (Device Registry, Telemetry)
-   **Services**: `/api/services` (Bookings)
-   **Payments**: `/api/payments` (Razorpay Orders)

## Database Schema

The app uses `Sequelize` with `sync({ alter: true })` for dev.
In production, use **migrations**.

## Project Structure

-   `src/models`: Database Models (Sequelize + TypeScript)
-   `src/controllers`: Business Logic
-   `src/routes`: API Routes
-   `src/middlewares`: Auth, Validation
-   `src/config`: DB & Env Config
