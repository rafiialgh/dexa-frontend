# Dexa Attendance System (Frontend)

A modern, responsive React-based frontend for the employee attendance system, built with TypeScript, Tailwind CSS, and a robust state management layer. This application serves as the primary interface for employees and administrators in the Dexa Ecosystem.

## Architecture Overview

- **Core**: React 19 with Vite for lightning-fast development and optimized production builds.
- **State Management**: Redux Toolkit for global authentication and UI state, combined with TanStack Query for server-side data synchronization.
- **UI System**: Built on Radix UI primitives and styled with Tailwind CSS 4, utilizing a customized Shadcn/UI component library.
- **Form Handling**: React Hook Form with Zod validation for type-safe and performant data entry.
- **Real-time Attendance**: Integrated with `react-webcam` for secure photo-verified check-in/out.

## Quick Start (Docker - Recommended)

This project is fully containerized and ready for production-like local testing.

1. **Configure Environment**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3000
   APP_CONTAINER_NAME=dexa-frontend
   APP_ENV=production
   APP_PORT=5173
   ```

2. **Start the Container**:
   ```bash
   docker-compose up --build -d
   ```

3. **Access the App**:
   The application will be available at [http://localhost:5173](http://localhost:5173).

## Local Development (No Docker)

To run the frontend directly on your host machine:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Ensure you have a `.env` file with `VITE_API_URL` pointing to your API Gateway.

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/components`: Reusable UI components, layout sections, and shadcn primitives.
- `src/hooks`: Custom React hooks for business logic and API data fetching (TanStack Query).
- `src/services`: API service layer for communication with the backend microservices.
- `src/store`: Redux slices and store configuration for global application state.
- `src/pages`: Main application routes and page-level components.
- `src/lib`: Core utility functions, constants, and shared formatting logic.

## Common Commands

- **Development**: `npm run dev`
- **Build Production**: `npm run build`
- **Linting**: `npm run lint`
- **Preview Build**: `npm run preview`

> [!IMPORTANT]
> **API Dependency**: This frontend requires the [Dexa API Gateway](https://github.com/rafiialgh/dexa-backend) to be running (typically on port 3000) for authentication and data management features to work.
