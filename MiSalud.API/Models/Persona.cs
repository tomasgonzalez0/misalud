namespace MiSalud.API.Models
{
    public class Persona
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public string RegistroId { get; set; }
        public string Password { get; set; }
    }
}
