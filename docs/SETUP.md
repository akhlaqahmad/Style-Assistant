# Project Setup Guide

This guide will walk you through setting up the StylistA project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

1.  **Node.js**: LTS version recommended (v18+).
2.  **npm**: Comes with Node.js.
3.  **Expo CLI**: `npm install -g expo-cli`.
4.  **Git**: For version control.
5.  **PostgreSQL**: (Optional) For the backend database.

## Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/StylistA.git
    cd StylistA
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

## Running the Application

### Development Mode

To start the development server and run the app on your device or simulator:

```bash
npm run expo:dev
```

-   **iOS Simulator**: Press `i` in the terminal.
-   **Android Emulator**: Press `a` in the terminal.
-   **Physical Device**: Download the Expo Go app and scan the QR code.

### Backend Server

To run the backend server:

```bash
npm run server:dev
```

This starts the Express server on port 5000 (default).

### Building for Production

To create a production build of the server:

```bash
npm run server:build
```

To run the production server:

```bash
npm run server:prod
```

### Database Setup

If using a local PostgreSQL database, ensure your connection string is set in `.env` (or environment variables).

To push schema changes to the database:

```bash
npm run db:push
```

## Troubleshooting

-   **Dependency Issues**: Run `npm install` again or delete `node_modules` and reinstall.
-   **Expo Errors**: Check the Expo Go app version and ensure it matches the SDK version.
-   **Server Connection**: Verify the backend server is running and accessible from the device (use your machine's IP address if testing on a physical device).
