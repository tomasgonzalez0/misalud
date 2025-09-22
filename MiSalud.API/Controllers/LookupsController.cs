using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiSalud.API.Data;

namespace MiSalud.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LookupsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public LookupsController(ApplicationDbContext db)
    {
        _db = db;
    }

    // GET: api/lookups/specialties
    // Devuelve las especialidades disponibles a partir de los médicos cargados
    [HttpGet("specialties")]
    public async Task<IActionResult> GetSpecialties(CancellationToken ct)
    {
        var list = await _db.Medicos
            .AsNoTracking()
            .Select(m => m.Especialidad)
            .Where(s => s != null && s != "")
            .Distinct()
            .OrderBy(s => s)
            .ToListAsync(ct);

        // Si necesitas Id para la UI, generamos uno temporal en memoria
        var items = list.Select((name, idx) => new { Id = idx + 1, Name = name });
        return Ok(items);
    }

    // GET: api/lookups/doctors?specialty=Cardiologia
    [HttpGet("doctors")]
    public async Task<IActionResult> GetDoctors([FromQuery] string specialty, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(specialty))
            return BadRequest("El parámetro 'specialty' es obligatorio.");

        var items = await _db.Medicos
            .AsNoTracking()
            .Where(d => d.Especialidad == specialty)
            .OrderBy(d => d.Nombre)
            .Select(d => new
            {
                d.Id,
                FullName = d.Nombre,
                Specialty = d.Especialidad
            })
            .ToListAsync(ct);

        return Ok(items);
    }
}