namespace MiSalud.API.DTOs.Citas
{
    public class CitaPreviewRequest
    {
        public int PacienteId { get; set; }
        public int MedicoId { get; set; }
        // Fecha en formato "yyyy-MM-dd"
        public string Fecha { get; set; } = string.Empty;
        // Hora en formato "HH:mm" o "HH:mm:ss"
        public string Hora { get; set; } = string.Empty;
        public string Motivo { get; set; } = string.Empty;
    }
}