namespace MiSalud.API.Models
{
    public class Paciente : Persona
    {
        public ICollection<Cita>? Citas { get; set; }
        public ICollection<HistoriaClinica>? HistoriasClinicas { get; set; }
        public ICollection<Formula>? Formulas { get; set; }
    }
}
