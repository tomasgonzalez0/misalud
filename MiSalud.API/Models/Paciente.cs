namespace MiSalud.API.Models
{
    public class Paciente
    {
        public ICollection<Cita> Citas { get; set; }
        public ICollection<HistoriaClinica> HistoriasClinicas { get; set; }
    }
}
