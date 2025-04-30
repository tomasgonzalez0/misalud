```markdown
# MiSalud API

MiSalud API es una aplicación de gestión de pacientes, médicos, citas y diagnósticos.
Está construida con **ASP.NET Core** y **Entity Framework Core**.

## Requisitos

- **.NET SDK** (versión 6 o superior)
 [Descargar .NET SDK](https://dotnet.microsoft.com/download)
- **SQL Server** o **SQL Server Express**
 [Descargar SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- **Visual Studio** o **Visual Studio Code**
 [Descargar Visual Studio Code](https://code.visualstudio.com/Download)

## Cómo descargar el proyecto

```bash
git clone https://github.com/tuusuario/MiSalud-API.git
cd MiSalud-API
```

## Migración de la base de datos

1. Abre **MiSalud.API** en Visual Studio.
2. En la **Terminal**, ejecuta:

   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

   Esto creará la base de datos y las tablas.

## Ejecutar el proyecto

1. Abre **MiSalud.API** en **Visual Studio**.
2. Ejecuta la API con **F5** o el botón de "Ejecutar" en Visual Studio.

## Frontend (MiSalud.WEB)

1. Abre **MiSalud.WEB** en **Visual Studio Code**.
2. Ejecuta el proyecto desde el terminal:

   ```bash
   npm install
   npm start
   ```

   El frontend estará disponible en `Despues agregamos el link`.
