namespace MiSalud.API.Models
{
    public class Medico : Persona
    {
        public string Especialidad { get; set; }
        public ICollection<Cita>? Citas { get; set; }
        public ICollection<Diagnostico>? Diagnosticos { get; set; }
    }
}
