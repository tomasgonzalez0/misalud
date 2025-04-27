namespace MiSalud.API.Models
{
    public class Cita
    {
        public int Id { get; set; } // <- Esta propiedad Id será la clave primaria por convención

        public DateTime Fecha { get; set; }
        public TimeSpan Hora { get; set; }

        public int PacienteId { get; set; }
        public Paciente Paciente { get; set; }

        public int MedicoId { get; set; }
        public Medico Medico { get; set; }

        public string Estado { get; set; } = "Asignada"; // Asignada, Cancelada, Reasignada
    }
}
