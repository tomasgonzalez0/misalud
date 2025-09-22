using System.ComponentModel.DataAnnotations;

namespace MiSalud.API.Models
{
    public class Specialty
    {
        public int Id { get; set; }

        [Required, MaxLength(120)]
        public string Name { get; set; } = default!;

        public ICollection<Medico> Doctors { get; set; } = new List<Medico>();
    }
}