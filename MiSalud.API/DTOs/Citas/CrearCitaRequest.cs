namespace MiSalud.API.DTOs.Citas
{
    // Incluyo por si no lo tenías en carpeta DTOs (ajusta si ya existe)
    public class CrearCitaRequest
    {
        public int PacienteId { get; set; }
        public int MedicoId { get; set; }
        public string Fecha { get; set; } = string.Empty; // "yyyy-MM-ddTHH:mm:ss" (tomamos solo la parte de fecha para DateOnly)
        public string Hora { get; set; } = string.Empty;  // "HH:mm:ss" o "HH:mm"
        public string Motivo { get; set; } = string.Empty;
    }
}