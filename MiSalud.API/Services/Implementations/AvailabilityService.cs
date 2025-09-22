using Microsoft.EntityFrameworkCore;
using MiSalud.API.Data;
using MiSalud.API.DTOs.Citas;
using MiSalud.API.Services.Interfaces;

namespace MiSalud.API.Services.Implementations
{
    public class AvailabilityService : IAvailabilityService
    {
        private readonly ApplicationDbContext _db;

        public AvailabilityService(ApplicationDbContext db)
        {
            _db = db;
        }

        // medicoId: id del médico
        // fecha:     día en hora local (DateTime) que llega desde el front (solo usamos la parte de fecha)
        public async Task<IReadOnlyList<DisponibilidadSlotDto>> GetDoctorAvailabilityAsync(
            int medicoId, DateTime fecha, int timeZoneOffsetMinutes, CancellationToken ct)
        {
            // Normalizamos a DateOnly
            DateOnly fechaOnly = DateOnly.FromDateTime(fecha);

            // Día de la semana (0=Domingo ... 6=Sábado)
            int dow = (int)fechaOnly.DayOfWeek;

            // Reglas (patrones) de disponibilidad para ese médico y ese día
            var reglas = await _db.DisponibilidadesMedico
                .Where(a => a.MedicoId == medicoId && a.DiaSemana == dow)
                .ToListAsync(ct);

            if (reglas.Count == 0)
                return Array.Empty<DisponibilidadSlotDto>();

            // Citas ya tomadas (TimeOnly) para ese día
            var horasTomadas = await _db.Citas
                .Where(c => c.MedicoId == medicoId && c.Fecha == fechaOnly)
                .Select(c => c.Hora)
                .ToListAsync(ct);

            var ocupadas = new HashSet<TimeOnly>(horasTomadas);

            DateTime ahora = DateTime.Now;
            var slots = new List<DisponibilidadSlotDto>();

            foreach (var r in reglas)
            {
                if (r.HoraFin <= r.HoraInicio) continue;

                int slotMin = r.DuracionMinutos;
                // Construimos DateTime para iterar en el día (facilita sumas de minutos)
                DateTime inicioDia = fechaOnly.ToDateTime(TimeOnly.FromTimeSpan(r.HoraInicio));
                DateTime finDia = fechaOnly.ToDateTime(TimeOnly.FromTimeSpan(r.HoraFin));

                for (var s = inicioDia; s < finDia; s = s.AddMinutes(slotMin))
                {
                    var slotInicioTimeOnly = TimeOnly.FromDateTime(s);
                    var slotFinTimeOnly = TimeOnly.FromDateTime(s.AddMinutes(slotMin));

                    bool ocupado = ocupadas.Contains(slotInicioTimeOnly);

                    slots.Add(new DisponibilidadSlotDto
                    {
                        Fecha = fechaOnly,
                        HoraInicio = slotInicioTimeOnly,
                        HoraFin = slotFinTimeOnly,
                        Disponible = !ocupado && s > ahora
                    });
                }
            }

            return slots
                .OrderBy(x => x.HoraInicio)
                .ToList();
        }

        // Valida un slot específico y devuelve start/end (DateTime) si es válido
        public async Task<(DateTime startLocal, DateTime endLocal, string? reasonIfInvalid)> ValidateAndResolveSlotAsync(
            int medicoId, DateTime startLocal, int? slotMinutes, int timeZoneOffsetMinutes, CancellationToken ct)
        {
            DateOnly fechaOnly = DateOnly.FromDateTime(startLocal);
            int dow = (int)fechaOnly.DayOfWeek;

            var reglas = await _db.DisponibilidadesMedico
                .Where(a => a.MedicoId == medicoId && a.DiaSemana == dow)
                .ToListAsync(ct);

            if (reglas.Count == 0)
                return (default, default, "El médico no atiende el día seleccionado.");

            // Hora local (TimeSpan) para comparar con la regla (que guarda TimeSpan)
            TimeSpan horaInicioSlot = startLocal.TimeOfDay;

            // Regla que contiene esa hora
            var regla = reglas.FirstOrDefault(r =>
                horaInicioSlot >= r.HoraInicio && horaInicioSlot < r.HoraFin);

            if (regla == null)
                return (default, default, "La hora seleccionada no está dentro del horario del médico.");

            int slotMin = slotMinutes ?? regla.DuracionMinutos;

            // Validar que está alineado con la grilla
            double minutosDesdeInicio = (horaInicioSlot - regla.HoraInicio).TotalMinutes;
            if (minutosDesdeInicio % slotMin != 0)
                return (default, default, "La hora no coincide con la grilla de turnos.");

            DateTime endLocal = startLocal.AddMinutes(slotMin);

            if (startLocal <= DateTime.Now)
                return (default, default, "La hora seleccionada ya pasó.");

            // Verificar si ya existe cita
            bool ocupado = await _db.Citas.AnyAsync(c =>
                c.MedicoId == medicoId &&
                c.Fecha == fechaOnly &&
                c.Hora == TimeOnly.FromTimeSpan(horaInicioSlot), ct);

            if (ocupado)
                return (default, default, "El turno ya fue tomado por otro paciente.");

            return (startLocal, endLocal, null);
        }
    }
}