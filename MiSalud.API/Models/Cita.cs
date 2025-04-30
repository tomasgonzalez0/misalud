namespace MiSalud.API.Models
{
    public class Cita
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public TimeSpan Hora { get; set; }
        public string Estado { get; set; } = "Asignada";

        public int PacienteId { get; set; }
        public Paciente? Paciente { get; set; }

        public int MedicoId { get; set; }
        public Medico? Medico { get; set; }
    }
}
