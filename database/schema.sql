/*
    EFX Tracker Database Schema
    Microsoft SQL Server

    Database: EFXTrackerDB
*/

USE EFXTrackerDB;
GO

/* =========================
   USERS
   ========================= */
IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users
    (
        Id NVARCHAR(50) NOT NULL,
        FullName NVARCHAR(150) NOT NULL,
        Email NVARCHAR(255) NOT NULL,
        Username NVARCHAR(100) NOT NULL,
        PasswordHash NVARCHAR(255) NULL,
        Role NVARCHAR(50) NOT NULL
            CONSTRAINT CK_Users_Role CHECK (Role IN (N'Admin', N'Editor', N'Viewer')),

        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

        CONSTRAINT PK_Users PRIMARY KEY (Id),
        CONSTRAINT UQ_Users_Email UNIQUE (Email),
        CONSTRAINT UQ_Users_Username UNIQUE (Username)
    );
END
ELSE
BEGIN
    IF COL_LENGTH(N'dbo.Users', N'PasswordHash') IS NULL
    BEGIN
        ALTER TABLE dbo.Users ADD PasswordHash NVARCHAR(255) NULL;
    END
END
GO

/* =========================
   CLIENTS
   ========================= */
IF OBJECT_ID(N'dbo.Clients', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Clients
    (
        Id NVARCHAR(50) NOT NULL,
        FullName NVARCHAR(150) NOT NULL,
        ContactNumber NVARCHAR(50) NULL,
        Email NVARCHAR(255) NULL,
        Address NVARCHAR(500) NULL,

        CONSTRAINT PK_Clients PRIMARY KEY (Id)
    );
END
GO

/* =========================
   PACKAGES
   ========================= */
IF OBJECT_ID(N'dbo.Packages', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Packages
    (
        Id NVARCHAR(50) NOT NULL,
        Name NVARCHAR(150) NOT NULL,
        Description NVARCHAR(1000) NULL,
        Price DECIMAL(12, 2) NOT NULL
            CONSTRAINT CK_Packages_Price CHECK (Price >= 0),

        CONSTRAINT PK_Packages PRIMARY KEY (Id),
        CONSTRAINT UQ_Packages_Name UNIQUE (Name)
    );
END
GO

/* =========================
   SERVICES
   ========================= */
IF OBJECT_ID(N'dbo.Services', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Services
    (
        Id NVARCHAR(50) NOT NULL,
        Name NVARCHAR(150) NOT NULL,
        Description NVARCHAR(1000) NULL,
        Price DECIMAL(12, 2) NOT NULL
            CONSTRAINT CK_Services_Price CHECK (Price >= 0),

        CONSTRAINT PK_Services PRIMARY KEY (Id),
        CONSTRAINT UQ_Services_Name UNIQUE (Name)
    );
END
GO

/* =========================
   PROJECTS
   ========================= */
IF OBJECT_ID(N'dbo.Projects', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Projects
    (
        Id NVARCHAR(50) NOT NULL,

        ClientId NVARCHAR(50) NOT NULL,
        PackageId NVARCHAR(50) NOT NULL,
        ServiceId NVARCHAR(50) NOT NULL,

        ProjectType NVARCHAR(100) NOT NULL,
        EventDate DATE NOT NULL,
        StartTime TIME(0) NOT NULL,
        EndTime TIME(0) NOT NULL,
        Location NVARCHAR(500) NOT NULL,

        Status NVARCHAR(50) NOT NULL
            CONSTRAINT CK_Projects_Status
            CHECK (Status IN
            (
                N'Upcoming',
                N'In Progress',
                N'Confirmed',
                N'Completed',
                N'Cancelled'
            )),

        PaymentStatus NVARCHAR(50) NOT NULL
            CONSTRAINT CK_Projects_PaymentStatus
            CHECK (PaymentStatus IN
            (
                N'Pending',
                N'Partial',
                N'Paid',
                N'Overdue',
                N'Refunded'
            )),

        Notes NVARCHAR(MAX) NULL,

        CreatedAt DATE NOT NULL,
        UpdatedAt DATE NOT NULL,

        CONSTRAINT PK_Projects PRIMARY KEY (Id),

        CONSTRAINT FK_Projects_Clients
            FOREIGN KEY (ClientId)
            REFERENCES dbo.Clients(Id),

        CONSTRAINT FK_Projects_Packages
            FOREIGN KEY (PackageId)
            REFERENCES dbo.Packages(Id),

        CONSTRAINT FK_Projects_Services
            FOREIGN KEY (ServiceId)
            REFERENCES dbo.Services(Id),

        CONSTRAINT CK_Projects_TimeRange
            CHECK (EndTime > StartTime),

        CONSTRAINT CK_Projects_DateAudit
            CHECK (UpdatedAt >= CreatedAt)
    );
END
GO

/* =========================
   INDEXES
   ========================= */

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_Projects_EventDate'
      AND object_id = OBJECT_ID(N'dbo.Projects')
)
BEGIN
    CREATE INDEX IX_Projects_EventDate
        ON dbo.Projects(EventDate);
END
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_Projects_ClientId'
      AND object_id = OBJECT_ID(N'dbo.Projects')
)
BEGIN
    CREATE INDEX IX_Projects_ClientId
        ON dbo.Projects(ClientId);
END
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_Projects_Status'
      AND object_id = OBJECT_ID(N'dbo.Projects')
)
BEGIN
    CREATE INDEX IX_Projects_Status
        ON dbo.Projects(Status);
END
GO

PRINT 'EFXTrackerDB schema created successfully.';
GO
