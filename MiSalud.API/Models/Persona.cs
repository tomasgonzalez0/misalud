using System.ComponentModel.DataAnnotations;

namespace MiSalud.API.Models
{
    public abstract class Persona
    {
        public int Id { get; set; }

        [Required, MaxLength(120)]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Direccion { get; set; }

        [Phone, MaxLength(30)]
        public string? Telefono { get; set; }

        [Required, EmailAddress, MaxLength(256)]
        public string Email { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string RegistroId { get; set; } = string.Empty;

        public string? UserId { get; set; }
    }
}