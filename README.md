# MiSalud API

MiSalud API is an application for managing patients, doctors, appointments, and diagnoses.  
It is built with **ASP.NET Core** and **Entity Framework Core**.

## Requirements

- **.NET SDK** (version 6 or higher)  
  [Download .NET SDK](https://dotnet.microsoft.com/download)
- **SQL Server** or **SQL Server Express**  
  [Download SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- **Visual Studio** or **Visual Studio Code**  
  [Download Visual Studio Code](https://code.visualstudio.com/Download)

## How to Download the Project

```bash
git clone https://github.com/tuusuario/MiSalud.git
cd MiSalud.API
```

## Database Migration

1. Open **MiSalud.API** in Visual Studio.
2. In the **Terminal**, run:
   ```bash
   dotnet ef database update
   ```
This will create the database and tables.

## Run the Project

1. Open **MiSalud.API** in **Visual Studio**.
2. Run the API with **F5** or the "Run" button in Visual Studio.
   
Alternatively, if you do not have Visual Studio, use the following command in the MiSalud.API directory:
   ```bash
   dotnet run
   ```

# MiSalud WEB (Frontend)

1. Open **MiSalud.WEB** in **Visual Studio Code** or in the **terminal**.
2. Run the project from the terminal:
   ```bash
   npm install
   npm install react-router-dom
   npm run dev
   ```
You will get a local server where the frontend will be running `localhost:XXXX`.

# Project Configuration

### Frontend Changes (WEB)

* Change the `fetch` requests in the frontend (**MiSalud.WEB**) to the `localhost:XXXX` of your API.

### API Changes

* Change in `Program.cs` (**MiSalud.API**) the address:

   ```csharp
   policy.WithOrigins("")
   ```

to the address of your Frontend:

   ```csharp
   policy.WithOrigins("http://localhost:XXXX")
   ```

* If you work on Linux distributions or have a restricted SQL configuration, modify the connection string as follows:

   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=MiSalud;User Id=YourId(sa);Password=YourPassword.;TrustServerCertificate=true;"
   }
   ```
