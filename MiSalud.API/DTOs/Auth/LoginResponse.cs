namespace MiSalud.API.DTOs.Auth
{
    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAtUtc { get; set; }
        public string UserId { get; set; } = string.Empty; // AspNetUsers Id
        public int? PersonaId { get; set; } // Paciente/Medico/Secretaria Id
        public string? Role { get; set; }
        public string? Nombre { get; set; }
    }
}