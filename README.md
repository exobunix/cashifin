# Cashify Platform

A production-ready full-stack electronic device resale platform.

## Architecture

This project is organized as a Turborepo monorepo:

*   **`apps/admin-panel`**: Next.js Admin Portal.
*   **`apps/customer-app`**: Flutter mobile & web application for customers.
*   **`apps/partner-app`**: Flutter mobile & web application for pickup partners.
*   **`backend`**: Node.js + Express + Mongoose + TypeScript API backend.
*   **`packages/*`**: Shared modules (utilities, UI components, validations, pricing engine).

## Development Setup

1.  **Start Database Services:**
    ```bash
    docker-compose up -d
    ```

2.  **Install dependencies and start development server:**
    ```bash
    npm install
    npm run dev
    ```
