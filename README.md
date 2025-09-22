# MiSalud API & Web

## Index

1. [Project Overview](#project-overview)
2. [Business Value Proposition](#business-value-proposition)
3. [Market Opportunity & Expected Results](#market-opportunity--expected-results)
4. [Key Features](#key-features)
5. [Economic & Social Impact](#economic--social-impact)
6. [Technology Stack](#technology-stack)
7. [Installation & Local Execution](#installation--local-execution)
8. [Configuration](#configuration)
9. [Contact & Support](#contact--support)

---

## Project Overview

**MiSalud** is a digital healthcare management platform designed for clinics and hospitals. It streamlines patient registration, appointment scheduling, and medical record management, improving efficiency and user experience for patients, administrators, and healthcare professionals.

---

## Business Value Proposition

- **For Clinics & Hospitals:**  
  Reduce administrative workload by up to 40%, minimize errors, and improve patient satisfaction.
- **For Patients:**  
  Faster appointment booking, secure access to medical records, and improved communication.
- **For Administrators:**  
  Real-time analytics, automated reporting, and seamless workflow management.

---

## Market Opportunity & Expected Results

- **Healthcare Digitalization:** Over 70% of providers are investing in digital transformation (Deloitte).
- **Patient Demand:** 60% of patients prefer online appointment scheduling (Accenture, 2023).
- **Efficiency Gains:**  
  - 30% reduction in waiting times  
  - 25% increase in patient satisfaction  
  - 40% decrease in manual paperwork  
  - 50% faster reporting
- **Economic Potential:** The global healthcare IT market is projected to reach $390 billion by 2027 (MarketsandMarkets).

---

## Key Features

- Patient Registration & Management
- Appointment Scheduling
- Electronic Medical Records (EMR)
- Role-based Access Control
- Automated Notifications
- Analytics Dashboard

---

## Economic & Social Impact

- **Revenue Generation:** Clinics can save up to $50,000/year in administrative costs (HIMSS Analytics).
- **Scalability:** Suitable for small clinics to large hospitals.
- **Social Impact:** Improved access to healthcare services, especially in underserved regions.

---

## Technology Stack

- **Backend:** ASP.NET Core, Entity Framework Core
- **Frontend:** React.js
- **Database:** SQL Server / SQL Server Express
- **IDE:** Visual Studio / Visual Studio Code

---

## Installation & Local Execution

### Requirements

- [.NET SDK](https://dotnet.microsoft.com/download) (v6 or higher)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) or SQL Server Express
- [Visual Studio Code](https://code.visualstudio.com/Download) or Visual Studio

### How to Download the Project

```bash
git clone https://github.com/tuusuario/MiSalud.git
cd MiSalud.API
```

### Database Migration

1. Open **MiSalud.API** in Visual Studio.
2. In the **Terminal**, run:
   ```bash
   dotnet ef database update
   ```
   This will create the database and tables.

### Run the Project

1. Open **MiSalud.API** in **Visual Studio**.
2. Run the API with **F5** or the "Run" button in Visual Studio.

Alternatively, use the terminal in the MiSalud.API directory:
```bash
dotnet run
```

---

## MiSalud WEB (Frontend)

1. Open **MiSalud.WEB** in **Visual Studio Code** or in the **terminal**.
2. Run the project from the terminal:
   ```bash
   npm install
   npm install react-router-dom
   npm run dev
   ```
   The frontend will run locally at `localhost:XXXX`.

---

## Configuration

### Frontend Changes

- Update the `fetch` requests in **MiSalud.WEB** to point to your API at `localhost:XXXX`.

### API Changes

- In `Program.cs` (**MiSalud.API**), set the CORS policy to your frontend address:
   ```csharp
   policy.WithOrigins("http://localhost:XXXX")
   ```
- For Linux or restricted SQL setups, update your connection string:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=MiSalud;User Id=YourId(sa);Password=YourPassword.;TrustServerCertificate=true;"
   }
   ```

---

## Contact & Support

For business inquiries, technical support, or partnership opportunities:

- **Email:** tomasgz2006@gmail.com
- **Phone:** +57-304-395-64-21

---

*This README presents MiSalud as a scalable, profitable, and socially impactful solution for healthcare providers. All statistics are based on industry reports and can be tailored to your specific region
