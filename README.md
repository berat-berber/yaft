# YAFT

Yet Another Finance Tracker is a privacy-focused multi-bank transaction aggregator that allows users to upload, analyze and manage financial data from multiple Turkish banks in one unified interface.

## Preview

![Preview](https://yaftblobstorage.blob.core.windows.net/media/images/github-readme-preview.png)

## Live
**[Try YAFT Here](https://yaftapp.vercel.app)**

**[Check API Documentation](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/berat-berber/yaft/refs/heads/main/v1.json)**

**[See Load Test Results](https://yaftblobstorage.blob.core.windows.net/media/k6%20results/yaft-load-test-1)**

## Deployment Stack
- **Backend** -> **Azure**
- **Database** -> **Supabase**
- **Frontend** -> **Vercel**

## Problem Statement

Turkish banks provide transaction history through Excel exports, but each bank uses different formats and there's no way to view transactions across multiple accounts in one place. Existing solutions like Plaid require sharing bank credentials with third parties, raising privacy concerns.

Yaft solves this by allowing users to upload their own bank exports while maintaining complete control over their financial data.

## Features

- **Multi-Bank Support**: Upload and parse Excel files from Ziraat Bank and Is Bank (more banks coming soon)
- **Unified Dashboard**: View transactions from all accounts in one place
- **Privacy-First**: Your data never leaves your control - no bank credentials required
- **Account Management**: Create and manage multiple bank accounts
- **Transaction Editing**: Modify transaction descriptions to protect sensitive information
- **Duplicate Detection**: Automatically prevents duplicate transactions when uploading the same file multiple times
- **Secure Authentication**: JWT-based authentication with role-based authorization

## Tech Stack

- **.NET 10** - Modern, high-performance backend framework
- **ASP.NET Core Identity** - User management and authentication
- **JWT Bearer Authentication** - Secure, stateless API authentication
- **Entity Framework Core** - ORM for database operations
- **PostgreSQL** - Relational database
- **ClosedXML & NPOI** - Excel file parsing
- **FluentValidation** - Request validation

## Project Structure

```
Backend/
├── Controllers/        # API endpoints
├── DTOs/              
│   ├── Requests/      # Request models
│   └── Responses/     # Response models
├── Data/
    └─ AppDbContext.cs # Database connection  
├── Models/            # Database entities
├── Services/          # Business logic
├── Migrations/        # EF Core migrations
├── Program.cs         # Application entry point
└── Validators/        # FluentValidation Validators

Frontend/
```

**Key Design Decisions:**

- **Bank-specific parsers**: Each bank has its own parsing method to handle format differences
- **Privacy by design**: Files are parsed and discarded; only transaction data is stored
- **Role-based access**: Admin and User roles for future admin panel features
- **Normalized database**: Separate tables for currencies, categories, and accounts for flexibility

## Database Schema

- **AspNetUsers** (via ASP.NET Identity)
- **AspNetRoles** (via ASP.NET Identity)
- **AspNetUserRoles** (via ASP.NET Identity)
- **Accounts** - User's bank accounts
- **Transactions** - Individual transaction records with categorization
- **AccountCategories** - Types of accounts (Checking)
- **TransactionCategories** - Spending categories
- **Currencies** - Supported currency symbols

## Security Features

- Password hashing via ASP.NET Identity
- JWT tokens with expiration
- Role-based authorization
- Input validation with FluentValidation
- Parameterized queries (SQL injection protection via EF Core)

## What I Learned

- Parsing real-world financial data with inconsistent formats
- Handling Turkish date localization in Excel files
- Implementing JWT authentication with ASP.NET Core Identity
- Managing complex entity relationships with EF Core
- Building a full-stack application from scratch to deployment

## Future Enhancements

- [ ] Refresh token rotation
- [ ] Transaction categorization with ML
- [ ] Budget tracking and alerts
- [ ] Expand parsing reports (PDF)
- [ ] Support for additional Turkish banks
- [ ] Spending analytics and visualizations

## Run Locally

### Prerequisites
- Docker
- Git

### Run the Application

```bash
# Clone the repository
git clone https://github.com/berat-berber/yaft.git
cd yaft

# Start all services
docker compose up -d --build

# Access the application -> http://localhost:5173
```

To stop the application:
```bash
docker compose down
```

## Made By
Berat Berber
- LinkedIn: [www.linkedin.com/in/berat-berber]
