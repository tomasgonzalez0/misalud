using System.ComponentModel.DataAnnotations;

namespace MiSalud.API.DTOs.Auth
{
    public class RegisterPacienteRequest
    {
        [Required, MaxLength(50)]
        public string RegistroId { get; set; } = string.Empty;

        [Required, MaxLength(120)]
        public string Nombre { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(6)]
        public string Password { get; set; } = string.Empty;

        public string? Direccion { get; set; }
        public string? Telefono { get; set; }
    }
}