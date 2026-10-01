--CREATE DATABASE EducationalCenterERP;
--GO

USE EducationalCenterERP;
GO

--CREATE TABLE Roles
--(
--    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--    Name NVARCHAR(100) NOT NULL,
--    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
--    IsDeleted BIT NOT NULL DEFAULT 0
--);

--INSERT INTO Roles(Name)
--VALUES
--('Admin'),
--('Reception'),
--('Teacher'),
--('Accountant');

--CREATE TABLE Users
--(
--    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--    UserName NVARCHAR(100) NOT NULL,
--    FullName NVARCHAR(200) NOT NULL,
--    Phone NVARCHAR(20),
--    Email NVARCHAR(150),
--    PasswordHash NVARCHAR(MAX),
--    RoleId UNIQUEIDENTIFIER NOT NULL,
--    IsActive BIT DEFAULT 1,
--    LastLogin DATETIME2 NULL,
--    CreatedAt DATETIME2 DEFAULT GETDATE(),
--    IsDeleted BIT DEFAULT 0,
--    CONSTRAINT FK_Users_Roles
--    FOREIGN KEY(RoleId)
--    REFERENCES Roles(Id)
--);

--CREATE TABLE Students
--(
--    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--    StudentCode NVARCHAR(50) UNIQUE NOT NULL,
--    FullName NVARCHAR(200) NOT NULL,
--    Phone NVARCHAR(20),
--    ParentPhone NVARCHAR(20),
--    Address NVARCHAR(300),
--    School NVARCHAR(150),
--    Grade NVARCHAR(50),
--    Gender NVARCHAR(20),
--    BirthDate DATE NULL,
--    QRCode NVARCHAR(200) UNIQUE NOT NULL,
--    IsActive BIT DEFAULT 1,
--    CreatedAt DATETIME2 DEFAULT GETDATE(),
--    IsDeleted BIT DEFAULT 0
--);

--CREATE TABLE Teachers
--(
--    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--    FullName NVARCHAR(200) NOT NULL,
--    Phone NVARCHAR(20),
--    Email NVARCHAR(150),
--    Address NVARCHAR(300),
--    Salary DECIMAL(18,2),
--    IsActive BIT DEFAULT 1,
--    CreatedAt DATETIME2 DEFAULT GETDATE(),
--    IsDeleted BIT DEFAULT 0
--);

--CREATE TABLE Subjects
--(
--    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--    Name NVARCHAR(100) NOT NULL,
--    Description NVARCHAR(300),
--    CreatedAt DATETIME2 DEFAULT GETDATE(),
--    IsDeleted BIT DEFAULT 0
--);

--CREATE TABLE Classes
--(
--    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--    SubjectId UNIQUEIDENTIFIER NOT NULL,
--    TeacherId UNIQUEIDENTIFIER NOT NULL,
--    ClassName NVARCHAR(100),
--    DayName NVARCHAR(20),
--    StartTime TIME,
--    EndTime TIME,
--    CreatedAt DATETIME2 DEFAULT GETDATE(),
--    CONSTRAINT FK_Classes_Subjects
--    FOREIGN KEY(SubjectId)
--    REFERENCES Subjects(Id),
--    CONSTRAINT FK_Classes_Teachers
--    FOREIGN KEY(TeacherId)
--    REFERENCES Teachers(Id)
--);

--CREATE TABLE StudentClasses
--(
--    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--    StudentId UNIQUEIDENTIFIER NOT NULL,
--    ClassId UNIQUEIDENTIFIER NOT NULL,
--    MonthlyFee DECIMAL(18,2),
--    JoinDate DATE DEFAULT GETDATE(),
--    CONSTRAINT FK_StudentClasses_Students
--    FOREIGN KEY(StudentId)
--    REFERENCES Students(Id),
--    CONSTRAINT FK_StudentClasses_Classes
--    FOREIGN KEY(ClassId)
--    REFERENCES Classes(Id)
--);

--CREATE TABLE Attendance
--(
--    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--    StudentId UNIQUEIDENTIFIER NOT NULL,
--    ClassId UNIQUEIDENTIFIER NOT NULL,
--    AttendanceDate DATE NOT NULL,
--    AttendanceTime TIME NOT NULL,
--    Status NVARCHAR(20) NOT NULL,
--    CreatedBy UNIQUEIDENTIFIER,
--    CreatedAt DATETIME2 DEFAULT GETDATE(),
--    CONSTRAINT FK_Attendance_Students
--    FOREIGN KEY(StudentId)
--    REFERENCES Students(Id),
--    CONSTRAINT FK_Attendance_Classes
--    FOREIGN KEY(ClassId)
--    REFERENCES Classes(Id)
--);
--CREATE UNIQUE INDEX IX_Attendance_Unique
--ON Attendance(StudentId,ClassId,AttendanceDate);

--CREATE TABLE Payments
--(
--    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--    StudentId UNIQUEIDENTIFIER NOT NULL,
--    Month INT NOT NULL,
--    Year INT NOT NULL,
--    Amount DECIMAL(18,2),
--    PaidAmount DECIMAL(18,2),
--    Status NVARCHAR(20),
--    PaymentDate DATE DEFAULT GETDATE(),
--    CreatedBy UNIQUEIDENTIFIER,
--    CONSTRAINT FK_Payments_Students
--    FOREIGN KEY(StudentId)
--    REFERENCES Students(Id)
--);

--CREATE TABLE ActivityLogs
--(
--    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--    UserId UNIQUEIDENTIFIER,
--    Action NVARCHAR(200),
--    EntityName NVARCHAR(100),
--    CreatedAt DATETIME2 DEFAULT GETDATE()
--);

--ALTER TABLE Payments
--ADD
--    PaymentMethod NVARCHAR(50) NOT NULL DEFAULT 'Cash',
--    Notes NVARCHAR(300) NULL;

---- عدد الطلاب
--SELECT COUNT(*)
--FROM Students
--WHERE IsDeleted=0

---- الطلاب الذين لم يدفعوا هذا الشهر
--SELECT *
--FROM Students S
--WHERE NOT EXISTS
--(
--SELECT 1
--FROM Payments P
--WHERE P.StudentId=S.Id
--AND P.Month=MONTH(GETDATE())
--AND P.Year=YEAR(GETDATE())
--)

---- إجمالي دخل الشهر
--SELECT SUM(Amount)
--FROM Payments
--WHERE Month=MONTH(GETDATE())
--AND Year=YEAR(GETDATE())

