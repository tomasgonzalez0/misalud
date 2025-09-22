using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MiSalud.API.Data;
using MiSalud.API.Models;
using MiSalud.API.Services.Interfaces;
using System.Net;
using System.Net.Mail;

namespace MiSalud.API.Services.Implementations
{
    public class EmailSettings
    {
        public string SmtpHost { get; set; } = "localhost";
        public int SmtpPort { get; set; } = 25;
        public bool EnableSsl { get; set; } = false;
        public string FromAddress { get; set; } = "no-reply@misalud.local";
        public string? Username { get; set; }
        public string? Password { get; set; }
    }

    public class EmailNotificationService : INotificationService
    {
        private readonly ApplicationDbContext _db;
        private readonly EmailSettings _settings;

        public EmailNotificationService(ApplicationDbContext db, IOptions<EmailSettings> options)
        {
            _db = db;
            _settings = options.Value;
        }

        public async Task EnviarConfirmacionAsync(Cita cita, CancellationToken ct)
        {
            var appt = await _db.Citas
                .Include(c => c.Paciente)
                .Include(c => c.Medico)
                .FirstAsync(c => c.Id == cita.Id, ct);

            var subject = $"Confirmación de cita - {appt.Medico!.Especialidad}";
            var fechaHora = appt.Fecha.ToDateTime(appt.Hora); // CORREGIDO
            var body = $"Hola {appt.Paciente!.Nombre},\n\n" +
                       $"Tu cita ha sido confirmada:\n" +
                       $"- Especialidad: {appt.Medico!.Especialidad}\n" +
                       $"- Médico: {appt.Medico!.Nombre}\n" +
                       $"- Fecha/Hora: {fechaHora:yyyy-MM-dd HH\\:mm}\n\n" +
                       $"Gracias por utilizar MiSalud.";

            await SendEmailAsync(appt.Paciente!.Email, subject, body, ct);
        }

        public async Task EnviarRecordatorioAsync(Cita cita, CancellationToken ct)
        {
            var appt = await _db.Citas
                .Include(c => c.Paciente)
                .Include(c => c.Medico)
                .FirstAsync(c => c.Id == cita.Id, ct);

            var subject = $"Recordatorio: Cita en 24 horas - {appt.Medico!.Especialidad}";
            var fechaHora = appt.Fecha.ToDateTime(appt.Hora); // CORREGIDO
            var body = $"Hola {appt.Paciente!.Nombre},\n\n" +
                       $"Te recordamos tu cita programada para mañana:\n" +
                       $"- Especialidad: {appt.Medico!.Especialidad}\n" +
                       $"- Médico: {appt.Medico!.Nombre}\n" +
                       $"- Fecha/Hora: {fechaHora:yyyy-MM-dd HH\\:mm}\n\n" +
                       $"MiSalud.";

            await SendEmailAsync(appt.Paciente!.Email, subject, body, ct);
        }

        private async Task SendEmailAsync(string to, string subject, string body, CancellationToken ct)
        {
            using var client = new SmtpClient(_settings.SmtpHost, _settings.SmtpPort)
            {
                EnableSsl = _settings.EnableSsl
            };
            if (!string.IsNullOrWhiteSpace(_settings.Username))
            {
                client.Credentials = new NetworkCredential(_settings.Username, _settings.Password);
            }
            var msg = new MailMessage(_settings.FromAddress, to, subject, body);
            await client.SendMailAsync(msg, ct);
        }
    }
}