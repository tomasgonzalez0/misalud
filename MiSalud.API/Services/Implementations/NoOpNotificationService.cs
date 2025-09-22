using MiSalud.API.Models;
using MiSalud.API.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace MiSalud.API.Services.Implementations
{
    public class NoOpNotificationService : INotificationService
    {
        private readonly ILogger<NoOpNotificationService> _logger;

        public NoOpNotificationService(ILogger<NoOpNotificationService> logger)
        {
            _logger = logger;
        }

        public Task EnviarConfirmacionAsync(Cita cita, CancellationToken ct = default)
        {
            _logger.LogInformation("Notificación confirmación (simulada) - Cita {Id} Paciente {PacienteId} Médico {MedicoId} {Fecha} {Hora}",
                cita.Id, cita.PacienteId, cita.MedicoId, cita.Fecha, cita.Hora);
            return Task.CompletedTask;
        }

        public Task EnviarRecordatorioAsync(Cita cita, CancellationToken ct = default)
        {
            _logger.LogInformation("Recordatorio (simulado) - Cita {Id} (Paciente {PacienteId}) programada para {Fecha} {Hora}",
                cita.Id, cita.PacienteId, cita.Fecha, cita.Hora);
            return Task.CompletedTask;
        }
    }
}