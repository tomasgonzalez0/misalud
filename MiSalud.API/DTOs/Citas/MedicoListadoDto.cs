namespace MiSalud.API.DTOs.Citas
{
    public class MedicoListadoDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Especialidad { get; set; } = string.Empty;
        public string? Email { get; set; }
    }
}