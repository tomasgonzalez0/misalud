using Microsoft.EntityFrameworkCore;
using MiSalud.API.Data;
using MiSalud.API.Services.Interfaces;

namespace MiSalud.API.Services.Implementations
{
    public class ReminderBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _sp;
        private readonly ILogger<ReminderBackgroundService> _logger;

        public ReminderBackgroundService(IServiceProvider sp, ILogger<ReminderBackgroundService> logger)
        {
            _sp = sp;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var delay = TimeSpan.FromMinutes(10);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _sp.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    var notifications = scope.ServiceProvider.GetRequiredService<INotificationService>();

                    DateTime now = DateTime.Now;
                    DateTime nowPlus24 = now.AddHours(24);
                    DateTime windowEnd = nowPlus24.AddMinutes(10);

                    DateOnly targetDateOnly = DateOnly.FromDateTime(nowPlus24);

                    // Ajusta el estado según tu lógica real ("Programada" si así guardas)
                    var candidatos = await db.Citas
                        .Where(c => c.Estado == "Programada" &&  // o "Asignada" si es tu valor real
                                    c.Fecha >= targetDateOnly.AddDays(-1) &&
                                    c.Fecha <= targetDateOnly.AddDays(1))
                        .ToListAsync(stoppingToken);

                    foreach (var c in candidatos)
                    {
                        // Si no tienes esta propiedad, agrégala al modelo Cita:
                        // public DateTime? ReminderSentUtc {get; set;}
                        if (c.ReminderSentUtc != null) continue;

                        var citaDateTime = c.Fecha.ToDateTime(c.Hora); // CORREGIDO

                        if (citaDateTime >= nowPlus24 && citaDateTime < windowEnd)
                        {
                            try
                            {
                                await notifications.EnviarRecordatorioAsync(c, stoppingToken);
                                c.ReminderSentUtc = DateTime.UtcNow;
                                await db.SaveChangesAsync(stoppingToken);
                            }
                            catch (Exception ex)
                            {
                                _logger.LogError(ex, "Error enviando recordatorio para cita {Id}", c.Id);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error en ReminderBackgroundService");
                }

                await Task.Delay(delay, stoppingToken);
            }
        }
    }
}