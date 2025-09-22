namespace MiSalud.API.DTOs.Citas
{
    public class CitaPreviewResponse
    {
        public bool Disponible { get; set; }
        public string Mensaje { get; set; } = string.Empty;

        public int? PacienteId { get; set; }
        public int? MedicoId { get; set; }
        public string? Especialidad { get; set; }
        public string? MedicoNombre { get; set; }
        public string? Fecha { get; set; }
        public string? Hora { get; set; }
        public string? Motivo { get; set; }
    }
}