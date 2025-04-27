namespace MiSalud.API.Models
{
    public class Medico
    {
        public string Especialidad { get; set; }
        public ICollection<Cita> Citas { get; set; }
    }
}
