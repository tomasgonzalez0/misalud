using Microsoft.EntityFrameworkCore;
using MiSalud.API.Data;
using MiSalud.API.DTOs.Citas;
using MiSalud.API.Models;
using MiSalud.API.Services.Interfaces;

namespace MiSalud.API.Services.Implementations
{
    public class CitaService : ICitaService
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger<CitaService> _logger;

        public CitaService(ApplicationDbContext db, ILogger<CitaService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<Cita> CrearAsync(CrearCitaRequest request, CancellationToken ct)
        {
            // Parseos
            if (!DateTime.TryParse(request.Fecha, out var fechaInput))
                throw new InvalidOperationException("Fecha inválida (formato esperado yyyy-MM-dd...).");

            DateOnly fecha = DateOnly.FromDateTime(fechaInput);

            TimeOnly hora;
            if (TimeOnly.TryParse(request.Hora, out var h1))
                hora = h1;
            else
                throw new InvalidOperationException("Hora inválida (formato esperado HH:mm).");

            // Validaciones básicas
            var pacienteExiste = await _db.Pacientes.AnyAsync(p => p.Id == request.PacienteId, ct);
            if (!pacienteExiste) throw new InvalidOperationException("Paciente no existe.");

            var medico = await _db.Medicos.FirstOrDefaultAsync(m => m.Id == request.MedicoId, ct);
            if (medico == null) throw new InvalidOperationException("Médico no existe.");

            // Validar disponibilidad (slot libre)
            bool ocupado = await _db.Citas.AnyAsync(c =>
                c.MedicoId == request.MedicoId &&
                c.Fecha == fecha &&
                c.Hora == hora, ct);

            if (ocupado) throw new InvalidOperationException("El turno ya está ocupado.");

            var cita = new Cita
            {
                PacienteId = request.PacienteId,
                MedicoId = request.MedicoId,
                Fecha = fecha,
                Hora = hora,
                Motivo = request.Motivo.Trim(),
                Estado = "Programada"
            };

            _db.Citas.Add(cita);
            await _db.SaveChangesAsync(ct);
            return cita;
        }

        public Task<Cita?> GetByIdAsync(int id, CancellationToken ct)
        {
            return _db.Citas
                .Include(c => c.Medico)
                .Include(c => c.Paciente)
                .FirstOrDefaultAsync(c => c.Id == id, ct);
        }

        public async Task<IReadOnlyList<string>> GetEspecialidadesAsync(CancellationToken ct)
        {
            return await _db.Medicos
                .Where(m => m.Especialidad != null && m.Especialidad != "")
                .Select(m => m.Especialidad)
                .Distinct()
                .OrderBy(x => x)
                .ToListAsync(ct);
        }
        public async Task<IReadOnlyList<MedicoListadoDto>> GetMedicosPorEspecialidadAsync(string especialidad, CancellationToken ct)
        {
            especialidad = especialidad.Trim();

            // Si se usa Specialty table y Medico quizás debería tener SpecialtyId (no mostrado en modelo). Aquí usamos el string simple.
            var query = _db.Medicos
                .Where(m => m.Especialidad == especialidad)
                .OrderBy(m => m.Nombre)
                .Select(m => new MedicoListadoDto
                {
                    Id = m.Id,
                    Nombre = m.Nombre,
                    Especialidad = m.Especialidad,
                    Email = m.Email
                });

            return await query.ToListAsync(ct);
        }

        public async Task<IReadOnlyList<string>> GetDisponibilidadAsync(int medicoId, DateOnly fecha, CancellationToken ct)
        {
            // Slots base cada 30 min de 08:00 a 17:00 (excluyendo 12:30 si quieres, aquí NO la excluyo)
            var inicio = new TimeOnly(8, 0);
            var fin = new TimeOnly(17, 0);
            var intervalo = TimeSpan.FromMinutes(30);

            var slots = new List<TimeOnly>();
            var cursor = inicio;
            while (cursor < fin)
            {
                slots.Add(cursor);
                cursor = cursor.Add(intervalo);
            }

            var ocupados = await _db.Citas
                .Where(c => c.MedicoId == medicoId && c.Fecha == fecha)
                .Select(c => c.Hora)
                .ToListAsync(ct);

            var resultado = slots
                .Where(s => !ocupados.Contains(s))
                .ToList();

            // Si la fecha es hoy, eliminar horas pasadas
            if (fecha == DateOnly.FromDateTime(DateTime.Now))
            {
                var ahora = TimeOnly.FromDateTime(DateTime.Now);
                resultado = resultado.Where(r => r > ahora).ToList();
            }

            // Retornar como strings "HH:mm"
            return resultado
                .Select(r => r.ToString("HH:mm"))
                .ToList();
        }

        public async Task<CitaPreviewResponse> PreviewAsync(CitaPreviewRequest request, CancellationToken ct)
        {
            var resp = new CitaPreviewResponse
            {
                PacienteId = request.PacienteId,
                MedicoId = request.MedicoId,
                Motivo = request.Motivo
            };

            if (!DateTime.TryParse(request.Fecha, out var fechaDT))
            {
                resp.Disponible = false;
                resp.Mensaje = "Fecha inválida.";
                return resp;
            }

            DateOnly fecha = DateOnly.FromDateTime(fechaDT);

            if (!TimeOnly.TryParse(request.Hora, out var hora))
            {
                resp.Disponible = false;
                resp.Mensaje = "Hora inválida.";
                return resp;
            }

            var medico = await _db.Medicos.FirstOrDefaultAsync(m => m.Id == request.MedicoId, ct);
            if (medico == null)
            {
                resp.Disponible = false;
                resp.Mensaje = "Médico no existe.";
                return resp;
            }

            resp.MedicoNombre = medico.Nombre;
            resp.Especialidad = medico.Especialidad;
            resp.Fecha = fecha.ToString("yyyy-MM-dd");
            resp.Hora = hora.ToString("HH:mm");

            // Ya ocupada?
            bool ocupado = await _db.Citas.AnyAsync(c =>
                c.MedicoId == medico.Id &&
                c.Fecha == fecha &&
                c.Hora == hora, ct);

            if (ocupado)
            {
                resp.Disponible = false;
                resp.Mensaje = "El turno ya está ocupado.";
                return resp;
            }

            // Validar que el slot aparezca en disponibilidad generada
            var disponibles = await GetDisponibilidadAsync(medico.Id, fecha, ct);
            if (!disponibles.Contains(hora.ToString("HH:mm")))
            {
                resp.Disponible = false;
                resp.Mensaje = "El horario no está disponible.";
                return resp;
            }

            resp.Disponible = true;
            resp.Mensaje = "OK";
            return resp;
        }
    }
}