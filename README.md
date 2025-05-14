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
git clone https://github.com/tuusuario/MiSalud.git
cd MiSalud.API
```


## Migración de la base de datos

1. Abre **MiSalud.API** en Visual Studio.
2. En la **Terminal**, ejecuta:

```markdown
dotnet ef database update
```

Esto creará la base de datos y las tablas.

## Ejecutar el proyecto

1. Abre **MiSalud.API** en **Visual Studio**.
2. Ejecuta la API con **F5** o el botón de "Ejecutar" en Visual Studio.
   
Otra opcion en caso de no tener visual studio, usar el siguiente comando parado en MiSalud.API
```markdown
dotnet run
```
<br> <br/>

# MiSalud WEB (Frontend)

1. Abre **MiSalud.WEB** en **Visual Studio Code** o en la **terminal**.
2. Ejecuta el proyecto desde el terminal:

```markdown
npm install
npm install react-router-dom
npm run dev
```

Nos arrojara un servidor local donde se ejecutara el frontend `localhost:XXXX`.
<br><br/>
# Configurar el proyecto

### Cambios en el front (WEB)

* Cambiar las peticiones `fetch` en el front (**MiSalud.WEB**) al `localhost:XXXX` de tu API.

### Cambios en la API

* Cambiar en el `Program.cs` (**MiSalud.API**) la dirección de:

```csharp
policy.WithOrigins("")
```

por la dirección de tu Frontend:

```csharp
policy.WithOrigins("http://localhost:XXXX")
```

* Si trabajas en distribuciones Linux o tienes una configuración de SQL restringida, modifica la cadena de conexión de esta manera:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=MiSalud;User Id=TuId(sa);Password=TuContraseña.;TrustServerCertificate=true;"
}
```
