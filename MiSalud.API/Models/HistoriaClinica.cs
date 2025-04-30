namespace MiSalud.API.Models
{
    public class HistoriaClinica
    {
        public int Id { get; set; }
        public int PacienteId { get; set; }
        public Paciente? Paciente { get; set; }
        public ICollection<Diagnostico>? Diagnosticos { get; set; }
        public ICollection<Formula>? Formulas { get; set; }
    }
}
