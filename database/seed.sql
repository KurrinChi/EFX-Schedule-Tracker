/*
    EFX Tracker Seed Data
    Microsoft SQL Server

    Run schema.sql first.
*/

USE EFXTrackerDB;
GO

/* =========================
   USERS
   ========================= */
/*
   Development seed account:
   username: alex.morgan
   email: admin@efxcreations.test
    No password is assigned by this seed. The account must set a password through
    an authenticated provisioning flow before it can log in.
*/
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Id = N'usr-001')
BEGIN
    INSERT INTO dbo.Users
        (Id, FullName, Email, Username, PasswordHash, Role)
    VALUES
        (N'usr-001',
         N'Alex Morgan',
         N'admin@efxcreations.test',
         N'alex.morgan',
         NULL,
         N'Admin');
END
ELSE
BEGIN
    UPDATE dbo.Users
    SET FullName = N'Alex Morgan',
        Email = N'admin@efxcreations.test',
        Username = N'alex.morgan',
        Role = N'Admin'
    WHERE Id = N'usr-001';
END
GO

/* =========================
   CLIENTS
   ========================= */
INSERT INTO dbo.Clients
    (Id, FullName, ContactNumber, Email, Address)
SELECT
    v.Id,
    v.FullName,
    v.ContactNumber,
    v.Email,
    v.Address
FROM
(
    VALUES
        (N'cli-001', N'Maya Thompson', N'+1 555 0188', N'maya@example.com', N'Brooklyn, NY'),
        (N'cli-002', N'Jordan Ellis', N'+1 555 0126', N'jordan@example.com', N'Queens, NY'),
        (N'cli-003', N'Northline Studio', N'+1 555 0191', N'hello@northline.test', N'Manhattan, NY'),
        (N'cli-004', N'Avery & Co.', N'+1 555 0143', N'studio@avery.test', N'Jersey City, NJ')
) AS v(Id, FullName, ContactNumber, Email, Address)
WHERE NOT EXISTS
(
    SELECT 1
    FROM dbo.Clients c
    WHERE c.Id = v.Id
);
GO

/* =========================
   PACKAGES
   ========================= */
INSERT INTO dbo.Packages
    (Id, Name, Description, Price)
SELECT
    v.Id,
    v.Name,
    v.Description,
    v.Price
FROM
(
    VALUES
        (N'pkg-001', N'Signature Wedding', N'Full day photo and film coverage', CAST(4200.00 AS DECIMAL(12,2))),
        (N'pkg-002', N'Portrait Session', N'Two-hour editorial portrait session', CAST(850.00 AS DECIMAL(12,2))),
        (N'pkg-003', N'Brand Story', N'Commercial photo and video production', CAST(2800.00 AS DECIMAL(12,2)))
) AS v(Id, Name, Description, Price)
WHERE NOT EXISTS
(
    SELECT 1
    FROM dbo.Packages p
    WHERE p.Id = v.Id
);
GO

/* =========================
   SERVICES
   ========================= */
INSERT INTO dbo.Services
    (Id, Name, Description, Price)
SELECT
    v.Id,
    v.Name,
    v.Description,
    v.Price
FROM
(
    VALUES
        (N'svc-001', N'Photography', N'Still photography coverage', CAST(1800.00 AS DECIMAL(12,2))),
        (N'svc-002', N'Videography', N'Cinematic video coverage', CAST(2400.00 AS DECIMAL(12,2))),
        (N'svc-003', N'Drone Coverage', N'Licensed aerial capture', CAST(600.00 AS DECIMAL(12,2)))
) AS v(Id, Name, Description, Price)
WHERE NOT EXISTS
(
    SELECT 1
    FROM dbo.Services s
    WHERE s.Id = v.Id
);
GO

/* =========================
   PROJECTS
   ========================= */
INSERT INTO dbo.Projects
(
    Id,
    ClientId,
    PackageId,
    ServiceId,
    ProjectType,
    EventDate,
    StartTime,
    EndTime,
    Location,
    Status,
    PaymentStatus,
    Notes,
    CreatedAt,
    UpdatedAt
)
SELECT
    v.Id,
    v.ClientId,
    v.PackageId,
    v.ServiceId,
    v.ProjectType,
    v.EventDate,
    v.StartTime,
    v.EndTime,
    v.Location,
    v.Status,
    v.PaymentStatus,
    v.Notes,
    v.CreatedAt,
    v.UpdatedAt
FROM
(
    VALUES
    (
        N'prj-001',
        N'cli-001',
        N'pkg-001',
        N'svc-002',
        N'Wedding',
        CAST('2025-09-28' AS DATE),
        CAST('10:00' AS TIME),
        CAST('21:00' AS TIME),
        N'Prospect Park',
        N'In Progress',
        N'Paid',
        N'Golden hour portraits requested.',
        CAST('2025-07-12' AS DATE),
        CAST('2025-08-04' AS DATE)
    ),
    (
        N'prj-002',
        N'cli-003',
        N'pkg-003',
        N'svc-001',
        N'Commercial',
        CAST('2025-09-30' AS DATE),
        CAST('09:00' AS TIME),
        CAST('16:00' AS TIME),
        N'Northline HQ',
        N'Confirmed',
        N'Pending',
        N'Product shots and team portraits.',
        CAST('2025-07-19' AS DATE),
        CAST('2025-08-02' AS DATE)
    ),
    (
        N'prj-003',
        N'cli-002',
        N'pkg-002',
        N'svc-001',
        N'Portrait',
        CAST('2025-10-04' AS DATE),
        CAST('13:30' AS TIME),
        CAST('15:30' AS TIME),
        N'DUMBO Studio',
        N'Upcoming',
        N'Paid',
        N'Warm neutral backdrop.',
        CAST('2025-08-01' AS DATE),
        CAST('2025-08-03' AS DATE)
    ),
    (
        N'prj-004',
        N'cli-004',
        N'pkg-003',
        N'svc-003',
        N'Commercial',
        CAST('2025-08-18' AS DATE),
        CAST('07:00' AS TIME),
        CAST('12:00' AS TIME),
        N'Hoboken Waterfront',
        N'Completed',
        N'Paid',
        N'Coordinate with site manager.',
        CAST('2025-06-23' AS DATE),
        CAST('2025-08-19' AS DATE)
    ),
    (
        N'prj-005',
        N'cli-001',
        N'pkg-001',
        N'svc-001',
        N'Wedding',
        CAST('2025-08-10' AS DATE),
        CAST('11:00' AS TIME),
        CAST('20:00' AS TIME),
        N'The Foundry',
        N'Completed',
        N'Paid',
        N'Deliver gallery within 14 days.',
        CAST('2025-05-14' AS DATE),
        CAST('2025-08-24' AS DATE)
    )
) AS v
(
    Id,
    ClientId,
    PackageId,
    ServiceId,
    ProjectType,
    EventDate,
    StartTime,
    EndTime,
    Location,
    Status,
    PaymentStatus,
    Notes,
    CreatedAt,
    UpdatedAt
)
WHERE NOT EXISTS
(
    SELECT 1
    FROM dbo.Projects p
    WHERE p.Id = v.Id
);
GO

PRINT 'EFXTrackerDB seed data inserted successfully.';
GO

/* =========================
   VERIFICATION
   ========================= */
SELECT 'Users' AS TableName, COUNT(*) AS RecordCount FROM dbo.Users
UNION ALL
SELECT 'Clients', COUNT(*) FROM dbo.Clients
UNION ALL
SELECT 'Packages', COUNT(*) FROM dbo.Packages
UNION ALL
SELECT 'Services', COUNT(*) FROM dbo.Services
UNION ALL
SELECT 'Projects', COUNT(*) FROM dbo.Projects;
GO
