using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiSalud.API.DTOs.Citas;
using MiSalud.API.Services.Interfaces;

namespace MiSalud.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CitasController : ControllerBase
    {
        private readonly ICitaService _citaService;
        private readonly ILogger<CitasController> _logger;
        private readonly IWebHostEnvironment _env;

        public CitasController(
            ICitaService citaService,
            ILogger<CitasController> logger,
            IWebHostEnvironment env)
        {
            _citaService = citaService;
            _logger = logger;
            _env = env;
        }

        // 1. Especialidades
        [HttpGet("especialidades")]
        public async Task<IActionResult> GetEspecialidades(CancellationToken ct)
        {
            var data = await _citaService.GetEspecialidadesAsync(ct);
            return Ok(data);
        }

        // 2. Médicos por especialidad
        [HttpGet("medicos")]
        public async Task<IActionResult> GetMedicos([FromQuery] string especialidad, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(especialidad))
                return BadRequest("Debe especificar la especialidad.");

            var data = await _citaService.GetMedicosPorEspecialidadAsync(especialidad, ct);
            return Ok(data);
        }

        // 3. Disponibilidad por médico y fecha
        [HttpGet("disponibilidad")]
        public async Task<IActionResult> GetDisponibilidad([FromQuery] int medicoId, [FromQuery] DateTime fecha, CancellationToken ct)
        {
            if (medicoId <= 0)
                return BadRequest("medicoId inválido.");

            DateOnly fechaOnly = DateOnly.FromDateTime(fecha);
            var data = await _citaService.GetDisponibilidadAsync(medicoId, fechaOnly, ct);
            return Ok(data);
        }

        // 4. Preview (resumen antes de confirmar)
        [HttpPost("preview")]
        public async Task<IActionResult> Preview([FromBody] CitaPreviewRequest request, CancellationToken ct)
        {
            var result = await _citaService.PreviewAsync(request, ct);
            return Ok(result);
        }

        // 5. Crear cita definitiva
        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] CrearCitaRequest request, CancellationToken ct)
        {
            try
            {
                var cita = await _citaService.CrearAsync(request, ct);

                var dto = new
                {
                    cita.Id,
                    cita.PacienteId,
                    cita.MedicoId,
                    fecha = cita.Fecha.ToString("yyyy-MM-dd"),
                    hora = cita.Hora.ToString("HH:mm:ss"),
                    cita.Estado,
                    cita.Motivo
                };

                return CreatedAtAction(nameof(GetById), new { id = cita.Id }, dto);
            }
            catch (InvalidOperationException valEx)
            {
                return BadRequest(new { message = valEx.Message });
            }
            catch (DbUpdateException dbEx)
            {
                var detail = dbEx.InnerException?.Message ?? dbEx.Message;
                if (detail.Contains("IX_Citas", StringComparison.OrdinalIgnoreCase))
                {
                    return Conflict(new { message = "El turno ya fue tomado justo ahora.", detail });
                }
                return StatusCode(500, new { message = "Error de base de datos al crear la cita.", detail });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inesperado creando la cita");
                if (_env.IsDevelopment())
                {
                    return StatusCode(500, new { message = "Error interno al crear la cita.", detail = ex.Message, stack = ex.StackTrace });
                }
                return StatusCode(500, "Error interno al crear la cita.");
            }
        }

        // 6. Get por Id
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id, CancellationToken ct)
        {
            var cita = await _citaService.GetByIdAsync(id, ct);
            if (cita == null) return NotFound();

            return Ok(new
            {
                cita.Id,
                cita.PacienteId,
                cita.MedicoId,
                fecha = cita.Fecha.ToString("yyyy-MM-dd"),
                hora = cita.Hora.ToString("HH:mm:ss"),
                cita.Estado,
                motivo = cita.Motivo
            });
        }
    }
}