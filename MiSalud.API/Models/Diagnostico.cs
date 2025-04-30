namespace MiSalud.API.Models
{
    public class Diagnostico
    {
        public int Id { get; set; }
        public string Descripcion { get; set; }
        public DateTime Fecha { get; set; }

        public int MedicoId { get; set; }
        public Medico? Medico { get; set; }

        public ICollection<HistoriaClinica>? HistoriasClinicas { get; set; }
    }
}
