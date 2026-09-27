# EFX Schedule Manager

A full-stack Schedule Manager built with ReactJS, Ant Design, Node.js, Express.js, and Microsoft SQL Server. The system provides a simple interface for managing schedule-related records through CRUD operations and a REST API.

## Features

* User registration and login
* Password hashing and authentication
* JWT-based authentication
* Protected API requests
* Dashboard
* Create, Read, Update, and Delete operations
* Search and filtering
* Form validation
* Required-field validation
* Loading and empty states
* Success and error feedback
* REST API integration
* Microsoft SQL Server database
* Responsive Ant Design interface

## Technology Stack

### Frontend

* ReactJS
* Ant Design
* JavaScript
* REST API
* State Management

### Backend

* Node.js
* Express.js
* REST API
* JWT Authentication
* bcrypt

### Database

* Microsoft SQL Server
* SQL Server Management Studio (SSMS)

## System Architecture

```text
ReactJS + Ant Design
        |
        | HTTP / REST API
        v
Node.js + Express.js
        |
        | SQL Queries
        v
Microsoft SQL Server
```

## Project Structure

```text
Schedule-Manager/
|
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
|
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   └── package.json
|
├── database/
│   ├── schema.sql
│   └── seed.sql
|
└── README.md
```

The exact structure may vary depending on the final project configuration.

## Requirements

Before running the project, install:

* Node.js
* npm
* Microsoft SQL Server
* SQL Server Management Studio (SSMS)
* Git

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/KurrinChi/EFX-Schedule-Tracker.git
cd Schedule-Manager
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

## Database Setup

1. Open SQL Server Management Studio.
2. Connect to your SQL Server instance.
3. Create the required database.
4. Execute the database schema script.
5. Execute the seed script if sample data is required.
6. Verify that the required tables were created successfully.

Database scripts are located in:

```text
database/
└── Updated database Table.sql
```

## Environment Configuration

Create the required environment file for the backend.

Example:

```env
PORT=5000
DB_SERVER=YOUR_SERVER
DB_DATABASE=YOUR_DATABASE
DB_USER=YOUR_USERNAME
DB_PASSWORD=YOUR_PASSWORD
JWT_SECRET=YOUR_SECRET
```

Use the actual environment variable names defined in the project.

Do not commit real passwords, JWT secrets, database credentials, or other sensitive information to GitHub.

## Running the Backend

From the server directory:

```bash
npm run dev
```

or, if the project uses the production/start command:

```bash
npm start
```

The backend should run on the configured port, for example:

```text
http://localhost:5000
```

## Running the Frontend

From the client directory:

```bash
npm run dev
```

Open the URL provided by Vite in the terminal, commonly:

```text
http://localhost:5173
```

## Application Flow

The main system flow is:

```text
Start SQL Server
        |
        v
Start Express/Node.js Backend
        |
        v
Start React Frontend
        |
        v
Open Application
        |
        v
Register / Login
        |
        v
Dashboard
        |
        v
Manage Schedule Records
        |
        +--> Create
        |
        +--> View
        |
        +--> Search / Filter
        |
        +--> Update
        |
        +--> Delete
        |
        v
Logout
```

## Authentication

The system uses authenticated API access.

The authentication flow is:

```text
Registration
      |
      v
Password Hashing
      |
      v
PasswordHash Stored in Database
      |
      v
Login
      |
      v
Password Verification
      |
      v
JWT Generated
      |
      v
Authenticated Requests
      |
      v
Protected API Access
```

Passwords are not stored as plaintext. Password verification uses the stored password hash.

Sensitive authentication information should never be committed to the repository.

## CRUD Workflow

The system follows a standard CRUD workflow.

### Create

Users can enter information through the appropriate form and submit a new record.

The frontend validates the input before sending the request to the REST API.

### Read

Existing records are retrieved from the backend and displayed through the frontend interface.

### Update

Existing records can be opened, modified, validated, and submitted for updating.

### Delete

Records can be removed through the appropriate delete action and confirmation flow.

## Validation

The system includes validation for applicable forms and operations.

Validation includes:

* Required fields
* Data formats
* Valid input types
* Authentication credentials
* Duplicate records where applicable
* Backend validation
* Database-related validation

Invalid input should be rejected before the operation is completed.

## Development Notes

Development initially focused on the frontend using ReactJS and Ant Design.

Mock data and placeholders were used to simulate API responses while the database environment was being prepared. This allowed the CRUD interface, forms, validation, dialogs, and system structure to be developed independently from the backend.

Once Microsoft SQL Server and the Express.js backend were configured, the mock-data implementation was transitioned to REST API data.

The final architecture connects:

```text
ReactJS
    |
    v
Express.js REST API
    |
    v
Microsoft SQL Server
```

This approach allowed the frontend and backend to be developed progressively while maintaining a clear separation between the user interface, API, and database.

## Testing and Verification

The completed system was checked for:

* Application startup
* Database connectivity
* Backend availability
* Frontend/API communication
* User registration
* User login
* Password hashing
* Password verification
* JWT authentication
* Protected API requests
* Logout
* Create operations
* Read operations
* Update operations
* Delete operations
* Search
* Filtering
* Form validation
* Error handling
* Loading states
* Empty states
* Database record updates
* API responses
* Authentication protection

## Development Challenges

One of the main development challenges was working with Microsoft SQL Server.

Previous database experience was primarily based on MySQL. Although many database concepts and SQL workflows are similar, configuring MSSQL, setting up SSMS, establishing the connection, and integrating the database with Node.js required additional research and troubleshooting.

Documentation, technical references, and video tutorials were used to understand the setup process and resolve configuration issues.

The database and API were eventually connected successfully, allowing the completed frontend to operate using live database data.

## Current Status

The Schedule Manager is functionally complete.

The system currently consists of:

* ReactJS frontend
* Ant Design UI
* Node.js backend
* Express.js REST API
* Microsoft SQL Server database
* Authentication system
* CRUD functionality
* Validation
* Search and filtering

The project may continue to undergo inspection for potential improvements, edge cases, performance optimizations, and future enhancements.

## Security Notes

Never commit the following to GitHub:

```text
.env
Database passwords
JWT secrets
API keys
Private credentials
Production authentication tokens
```

Use environment variables for sensitive configuration.

## License

This project is for educational/development purposes unless otherwise specified.

# Development Timeline and Notes

## 1. Frontend-First Development

During the first few days, development started with the frontend and overall system structure using ReactJS and Ant Design.

Although the conventional approach would be to establish the database first, SSMS 22 was not initially available, and an internet outage also prevented immediate setup.

To maintain development progress, the frontend was built using mock data and placeholders to simulate API responses.

The initial CRUD implementation included:

* Create, Read, Update, and Delete operations
* Form validation
* Required-field validation
* Data type and format validation
* Search and filtering
* Dialog and confirmation flows
* Loading and empty states
* Error and success feedback
* Responsive UI behavior
* Basic state management

This approach allowed the frontend to be developed independently while keeping the structure ready for a future REST API integration.

## 2. UI Development and Customization

As development progressed, Ant Design components were studied, customized, and adapted to fit the Schedule Manager system.

The interface was structured around a simple scheduling and management workflow, allowing users to manage records efficiently through a centralized dashboard.

The system focuses on:

* Viewing schedule information
* Creating new records
* Updating existing records
* Removing records
* Searching and filtering information
* Managing data through structured forms
* Providing clear feedback for user actions

The goal was to keep the system simple, organized, and practical while maintaining a consistent user experience.

## 3. Database and Backend Integration

After completing the initial frontend and mock-data implementation, development proceeded to the database and backend setup using:

* Node.js
* Express.js
* Microsoft SQL Server
* SQL Server Management Studio (SSMS)

The SQL Server database was structured to store the system's actual records and support the CRUD operations implemented in the frontend.

The Express.js backend acts as the REST API layer between the React frontend and SQL Server.

The final architecture follows:

ReactJS Frontend
↓
REST API
↓
Express.js / Node.js
↓
Microsoft SQL Server

Once the database and API were configured, the previously implemented mock-data structure was replaced with live REST API data with minimal changes to the frontend.

## 4. Testing and Final Verification

After completing the integration, the system underwent a final functional check covering:

* Application startup
* Database connection
* Backend/API availability
* Frontend-to-API communication
* User registration
* User login
* Password hashing and verification
* Authentication token handling
* Protected API requests
* Logout
* CRUD operations
* Form validation
* Required-field validation
* Search and filtering
* Create operations
* Read operations
* Update operations
* Delete operations
* Error handling
* Loading states
* Empty states
* Database record updates
* API responses
* Protected-route behavior

After these checks were completed successfully, the project was marked as complete and moved into the final inspection stage.

## 5. Development Challenges

The primary challenge during development was working with Microsoft SQL Server, as my previous database experience was primarily with MySQL.

Although both systems share many similar database concepts and SQL workflows, setting up MSSQL, configuring SSMS, establishing the database connection, and integrating it with the Node.js backend required additional learning.

Documentation, technical references, and video tutorials were used to understand the setup and configuration process.

After working through these challenges, the database, backend, API, and frontend were successfully integrated into a fully functioning system.

## 6. Final Status

The Schedule Manager was completed with a ReactJS frontend, Ant Design interface, Express.js REST API, Node.js backend, and Microsoft SQL Server database.

The project is considered functionally complete and will continue to undergo inspection and maintenance to identify potential improvements, edge cases, and future enhancements.
