using System.ComponentModel.DataAnnotations;

namespace MiSalud.API.DTOs.Auth
{
    public class LoginRequest
    {
        [Required]
        public string UserNameOrEmail { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}