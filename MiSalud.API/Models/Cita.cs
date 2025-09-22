namespace MiSalud.API.Models
{
    public class Cita
    {
        public int Id { get; set; }

        public int PacienteId { get; set; }
        public int MedicoId { get; set; }

        public DateOnly Fecha { get; set; }
        public TimeOnly Hora { get; set; }

        public string Motivo { get; set; } = string.Empty;
        public string Estado { get; set; } = "Programada";

        // Opcional: para recordatorio (elimina si no lo usas)
        public DateTime? ReminderSentUtc { get; set; }

        // PROPIEDADES DE NAVEGACIÓN (agregadas de nuevo)
        public Paciente Paciente { get; set; } = null!;
        public Medico Medico { get; set; } = null!;
    }
}