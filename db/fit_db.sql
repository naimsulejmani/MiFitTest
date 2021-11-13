USE master;
GO
DROP DATABASE IF EXISTS TestFit;
GO 

CREATE DATABASE TestFit;
GO

USE TestFit;
go
-- the logic of OOP in database -> all persons here the specilized ones to their table :)
CREATE TABLE dbo.Person (
	Id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	Name NVARCHAR(50) NOT NULL,
	Surname NVARCHAR(50) NOT NULL,
	Country NVARCHAR(50) NULL,
	City NVARCHAR(50) NULL,
	Email NVARCHAR(50) NOT NULL, 
	Username NVARCHAR(50) NOT NULL,
	[Password] NVARCHAR(500) NOT NULL,
	Salt NVARCHAR(50) null,
	InsertDate DATETIME NOT NULL DEFAULT(GETDATE()),
	InsertBy INT NOT NULL DEFAULT(0),
	UpdateDate DATETIME NULL,
	UpdateBy INT NULL,
	UpdateNo INT NOT NULL DEFAULT(0)
);
go

CREATE TABLE dbo.Coaches (
	Id INT NOT NULL IDENTITY(1,1) PRIMARY KEY ,
	PersonId INT NOT NULL FOREIGN KEY REFERENCES dbo.Person(Id) UNIQUE,
	CoachLevel CHAR(1) NOT NULL CHECK(CoachLevel IN ('S','M','H')),
	RegisterdDate DATETIME NOT NULL DEFAULT(GETDATE()),
	SessionPrice MONEY NOT NULL,
	IsPassive BIT NOT NULL DEFAULT(0),
	LastLoginAt DATETIME NULL,--also other information
	InsertDate DATETIME NOT NULL DEFAULT(GETDATE()),
	InsertBy INT NOT NULL DEFAULT(0),
	UpdateDate DATETIME NULL,
	UpdateBy INT NULL,
	UpdateNo INT NOT NULL DEFAULT(0)
);
GO



CREATE TABLE dbo.Clients (
	Id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	PersonId INT NOT NULL FOREIGN KEY REFERENCES dbo.Person(Id) UNIQUE,
	Comment NVARCHAR(2000),
	RegisterdDate DATETIME NOT NULL DEFAULT(GETDATE()),	
	IsPassive BIT NOT NULL DEFAULT(0),
	InsertDate DATETIME NOT NULL DEFAULT(GETDATE()),
	InsertBy INT NOT NULL DEFAULT(0),
	UpdateDate DATETIME NULL,
	UpdateBy INT NULL,
	UpdateNo INT NOT NULL DEFAULT(0)
);

GO

-- we could have also session type -> like half, full quarter or different else also to have price based on trainers,
-- based on experince and type of excercise and type of session types
CREATE TABLE dbo.TrainingSession(
		Id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
		CoachId INT NOT NULL FOREIGN KEY REFERENCES dbo.Coaches(Id),
		ClientId INT NOT NULL FOREIGN KEY REFERENCES dbo.Clients(Id),
		SessionDate DATE NOT NULL DEFAULT(GETDATE()),
		StartTime TIME NOT NULL DEFAULT(GETDATE()),
		SessionNo TINYINT NOT NULL,
		EndTime AS DATEADD(HOUR, SessionNo,StartTime),-- as calculated fields
		IsAproved BIT NULL,
		AproveDate DATETIME NULL, --can be another table 
		IsPassive BIT NOT NULL DEFAULT(0),
		InsertDate DATETIME NOT NULL DEFAULT(GETDATE()),
		InsertBy INT NOT NULL DEFAULT(0),
		UpdateDate DATETIME NULL,
		UpdateBy INT NULL,
		UpdateNo INT NOT NULL DEFAULT(0)
);
GO

CREATE TABLE PaySlip (
	Id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	TrainingSessionId INT NOT NULL FOREIGN KEY REFERENCES dbo.TrainingSession(Id),
	SessionNo TINYINT NOT NULL,
	Price MONEY NOT NULL,
	DiscountPercentage DECIMAL(5,2) NOT NULL DEFAULT(0),
	Amount MONEY NOT NULL, --can be calculated column, or can not be i have some logic why i left sometimes :)	
	IsPayed BIT NOT NULL DEFAULT(0),
	PayedDate DATETIME NULL 
	
);

--we can create different table to save the payment better if its cache or from other sources like bank, card payements, with installemnts, etc




/*
	Lets insert some dummy data
*/
INSERT INTO dbo.Person
(
    Name,
    Surname,
    Country,
    City,
    Email,
	Username,
    Password,
    Salt,
    InsertDate,
    InsertBy,
    UpdateDate,
    UpdateBy,
    UpdateNo
)
SELECT 'Naim','Sulejmani','Republika e Kosoves', 'Fushe Kosove','naim.sulejmani@gmail.com','naimsulejmani',' $2b$10$MFBCOpntT0wbhkQHsIwqGuecaDieSskH12QUoS7IVWa4M4lfl/DN6', CAST(NEWID() AS NVARCHAR(50)),GETDATE(),0,NULL,NULL,0  UNION ALL
SELECT 'Anders','Fjelstad','Norway', 'Oslo','anders@fjelstad.no','anders',CAST(NEWID() AS NVARCHAR(50)), CAST(NEWID() AS NVARCHAR(50)),GETDATE(),0,NULL,NULL,0  UNION ALL
SELECT 'Festim','Bajrami','Republika e Kosoves', 'Fushe Kosove','festim.bajrami@riinvest.net','festim.bajrami',CAST(NEWID() AS NVARCHAR(50)), CAST(NEWID() AS NVARCHAR(50)),GETDATE(),0,NULL,NULL,0  UNION ALL
SELECT 'Ridge','Robinson','USA', 'Los Angeles','ridge@usa.com','ridge1',CAST(NEWID() AS NVARCHAR(50)), CAST(NEWID() AS NVARCHAR(50)),GETDATE(),0,NULL,NULL,0  ;
go

INSERT INTO dbo.Clients
(
    PersonId,
    Comment,
    RegisterdDate,
    IsPassive,
    InsertDate,
    InsertBy,
    UpdateDate,
    UpdateBy,
    UpdateNo
)
SELECT p.Id,'N/A', GETDATE(),0,GETDATE(),0,NULL,NULL,0	 FROM dbo.Person AS p WHERE p.Id<3;

GO

INSERT INTO dbo.Coaches
(
    PersonId,
    CoachLevel,
    RegisterdDate,
    SessionPrice,
    IsPassive,
    LastLoginAt,
    InsertDate,
    InsertBy,
    UpdateDate,
    UpdateBy,
    UpdateNo
)
SELECT p.Id,'S', GETDATE(),50,0,null,GETDATE(),0,NULL,NULL,0	 FROM dbo.Person AS p WHERE p.Id>=3;

GO

CREATE VIEW dbo.uvw_Coaches
AS
SELECT c.Id AS CoachId,
       c.PersonId,
       c.CoachLevel,
       p.Name ,
       p.Surname ,
       p.Country ,
       p.City ,
       p.Email ,
	   p.Username ,
       c.RegisterdDate ,
       c.SessionPrice ,
       c.IsPassive 
FROM dbo.Coaches AS c
    INNER JOIN dbo.Person AS p
        ON p.Id = c.PersonId;

GO
CREATE VIEW dbo.uvw_Clients
AS
SELECT c.Id AS ClientId,
       c.PersonId,
       p.Name ,
       p.Surname ,
       p.Country ,
       p.City ,
       p.Email ,
	   p.Username ,
       c.RegisterdDate ,
       c.Comment ,
       c.IsPassive 
FROM dbo.Clients AS c
    INNER JOIN dbo.Person AS p
        ON p.Id = c.PersonId;

GO
CREATE VIEW uvw_NextTrainingSessions 
AS

SELECT ts.*,uc.Name+' '+uc.Surname AS Coach FROM dbo.TrainingSession AS ts INNER JOIN  dbo.uvw_Clients AS uc ON uc.ClientId = ts.ClientId
INNER JOIN dbo.uvw_Coaches AS uc2 ON uc2.CoachId = ts.CoachId
WHERE ts.SessionDate>=GETDATE()

go

--this will worl in sql 2017+
CREATE OR ALTER PROCEDURE dbo.usp_CoachSessions_GetAllBy
    @coachId INT NULL,
    @fromDate DATE NULL,
    @toDate DATE NULL
AS
SELECT ts.Id AS TrainingSessionId,
       ts.SessionDate,
       ts.CoachId,
       coach.Name AS CoachName,
       coach.Surname AS CoachSurname,
       client.Name,
       client.Surname,
       client.Email,
       client.Comment,
       client.IsPassive AS IsClientPassive,
       coach.IsPassive AS IsCoachPassive
FROM dbo.TrainingSession AS ts
    INNER JOIN dbo.uvw_Coaches AS coach
        ON coach.CoachId = ts.CoachId
    INNER JOIN dbo.uvw_Clients AS client
        ON client.ClientId = ts.ClientId
WHERE ts.CoachId = COALESCE(@coachId, ts.CoachId)
      AND ts.SessionDate
      BETWEEN COALESCE(@fromDate, ts.SessionDate) AND COALESCE(@toDate, ts.SessionDate);

GO

CREATE OR ALTER PROCEDURE dbo.usp_TrainingSession_Insert 
    @coachId INT,
    @clientId INT,
    @sessionDate DATE,
    @startTime TIME,
    @sessionNo tinyint
AS
--some validaiton to check if coach and clients are passive if yes throw an error and can manage better
IF EXISTS (SELECT * FROM dbo.Coaches AS c WHERE c.id=@coachId AND c.IsPassive=1)
BEGIN
    PRINT 'thrown an error here!';
	THROW 510011, 'Coach is passive', 1;  
END

IF EXISTS (SELECT * FROM dbo.Clients  AS c WHERE c.id=@clientId AND c.IsPassive=1)
BEGIN
    PRINT 'thrown an error here!';
	THROW 510012, 'Client is passive', 1; 
END

--validate if trainer is already booked for that some of that time
IF EXISTS (SELECT * FROM dbo.TrainingSession AS ts WHERE ts.CoachId=@coachId AND @startTime BETWEEN ts.StartTime AND ts.EndTime)
BEGIN
       PRINT 'Coach is bussy for this period, please change!';
	   THROW 510013, 'Coach is bussy for this period, please change', 1; 
END
DECLARE @trainingSessionId INT=0;

INSERT INTO dbo.TrainingSession
(
    CoachId,
    ClientId,
    SessionDate,
    StartTime,
    SessionNo,
    IsAproved,
    AproveDate,
    IsPassive,
    InsertDate,
    InsertBy,
    UpdateDate,
    UpdateBy,
    UpdateNo
)
VALUES
(   @coachId,       -- CoachId - int
    @clientId,       -- ClientId - int
    @sessionDate, -- SessionDate - date
    @startTime, -- StartTime - time
    @sessionNo,       -- SessionNo - tinyint
    NULL,    -- IsAproved - bit
    NULL,    -- AproveDate - datetime
    0, -- IsPassive - bit
    DEFAULT, -- InsertDate - datetime
    DEFAULT, -- InsertBy - int
    NULL,    -- UpdateDate - datetime
    NULL,    -- UpdateBy - int
    DEFAULT  -- UpdateNo - int
    );

SET @trainingSessionId = SCOPE_IDENTITY();

SELECT * FROM dbo.uvw_NextTrainingSessions AS u WHERE u.id=@trainingSessionId
RETURN @trainingSessionId



GO




CREATE OR ALTER PROCEDURE dbo.usp_TrainingSessionCoachesResponse
@coachId INT,
@trainingSessionId INT,
@approved BIT,
@aproveDate DATETIME
AS
/*
	EXEC dbo.usp_TrainingSessionCoachesResponse @coachId = 1,                       -- int
                                            @trainingSessionId = 1,             -- int
                                            @approved = 1,                   -- bit
                                            @aproveDate = '2021-11-13 02:21:57' -- datetime

*/






DECLARE @isPassive BIT, @isAproved BIT,@id int;

	SELECT @id=Id, @isPassive=ts.IsPassive, @isAproved=ts.IsAproved FROM dbo.TrainingSession AS ts WHERE ts.CoachId=@coachId AND ts.Id=@trainingSessionId
	--validate if this session is from this coaches maybe someone maliciosly called this procedure
	IF (@id IS NULL )
		BEGIN
		    PRINT 'thrown an error that this session doesnt belong to this trainer';
			THROW 510001, 'thrown an error that this session doesnt belong to this trainer', 1;  
		END

	IF(@isPassive=1)
	BEGIN
	    PRINT 'thrown an error that this training session is pasived by user';
		THROW 510002, 'thrown an error that this training session is pasived by user', 1;  
	END

	IF(@isAproved IS NOT NULL)
	BEGIN
	    PRINT 'You have already confirmed this session';
		THROW 510003, 'You have already confirmed this session', 1;  
	END

	BEGIN TRAN 
	UPDATE dbo.TrainingSession
	SET IsAproved=@approved, AproveDate=@aproveDate,
	UpdateDate=GETDATE(), UpdateBy=@coachId, UpdateNo=UpdateNo+1
	WHERE Id=@trainingSessionId;

	INSERT INTO dbo.PaySlip
	(
	    TrainingSessionId,
	    SessionNo,
	    Price,
	    DiscountPercentage,
	    Amount,IsPayed,PayedDate
	)
	SELECT ts.Id,ts.SessionNo,uc.SessionPrice,0,ts.SessionNo*uc.SessionPrice ,0,null
	FROM dbo.TrainingSession AS ts INNER JOIN dbo.uvw_Coaches AS uc ON uc.CoachId = ts.CoachId
	WHERE ts.Id=@trainingSessionId;


		IF(@@ERROR=0)
		COMMIT TRAN
	ELSE ROLLBACK tran

GO

CREATE OR ALTER PROCEDURE dbo.usp_PaySlip_Pay 
@paySlipId INT, --can be also characters or other logic
@clientId int,
@trainingSessionId int,
@amount money ,
@payedDate DATETIME
AS
BEGIN TRAN

	--lets add some validations check if this training sessions is from this client, check the amount etc!
	--check if it is already payed or unconfirmed etc
	--others validtations here 

	IF NOT EXISTS (SELECT * FROM dbo.TrainingSession AS ts WHERE ts.Id=@trainingSessionId AND ts.ClientId=@clientId)
	BEGIN
	    PRINT 'trhwon an errro with some error id that will manage in begin catch';
		THROW 510004, 'Doesnt exists client with this training sessionid', 1;  
	END

	IF NOT EXISTS (SELECT * FROM dbo.PaySlip AS ps WHERE ps.Id=@paySlipId AND ps.TrainingSessionId=@trainingSessionId)
	BEGIN
	    PRINT 'doesnt exists payslip for this trianin session id';
		THROW 510004, 'doesnt exists payslip for this trianin session id', 1;  
	END
	
	--i will add just one because its about 50minutes working on this db logic and procedure logic 
	--normally check if is the amount full

	IF EXISTS (
		SELECT * FROM dbo.PaySlip AS ps WHERE ps.Id=@paySlipId AND ps.Amount<>@amount
	)
	BEGIN
	    PRINT 'sorry not sorry will not allow different amount, excat amount needed';
		THROW 510004, 'The amount is not the same!!!', 1;  
	END

	UPDATE dbo.PaySlip
	SET IsPayed=1,PayedDate=@payedDate
	WHERE TrainingSessionId=@trainingSessionId

	IF(@@ERROR=0)
		COMMIT TRAN
	ELSE ROLLBACK tran



GO

CREATE OR ALTER PROCEDURE dbo.usp_Authenticate
@username NVARCHAR(50)
AS
DECLARE @personId INT = NULL,@password NVARCHAR(500)=null;

SELECT TOP (1) @personId=p.Id,@password=p.Password FROM dbo.Person AS p WHERE p.Username=@username ORDER BY p.Id


IF(@personId IS NULL)
BEGIN
    THROW 51000, 'The person does not exist.', 1;  
END

SELECT 'Coach' AS Type,c.CoachId AS Id, c.PersonId, c.Username,c.Email,c.Name,c.Surname,@password AS Password FROM dbo.uvw_Coaches  AS c WHERE c.PersonId=@personId AND c.IsPassive=0
UNION ALL
SELECT 'Client' AS Type, c.ClientId AS Id, c.PersonId, c.Username,c.Email,c.Name,c.Surname,@password AS Password  FROM dbo.uvw_Clients AS c WHERE c.PersonId=@personId AND c.IsPassive=0;


GO

EXEC dbo.usp_Authenticate @username = N'naimsulejmani'

GO


SELECT * FROM dbo.TrainingSession AS ts


