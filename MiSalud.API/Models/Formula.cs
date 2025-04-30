namespace MiSalud.API.Models
{
    public class Formula
    {
        public int Id { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int PacienteId { get; set; }
        public Paciente? Paciente { get; set; }
        public ICollection<Medicamento>? Medicamentos { get; set; }
        public ICollection<HistoriaClinica>? HistoriasClinicas { get; set; }
    }
}
