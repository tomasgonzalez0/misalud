using System.ComponentModel.DataAnnotations;

namespace MiSalud.API.Models
{
    public class DisponibilidadMedico
    {
        public int Id { get; set; }

        [Required]
        public int MedicoId { get; set; }
        public Medico Medico { get; set; } = default!;

        // 0 = Domingo ... 6 = Sábado
        [Range(0, 6)]
        public int DiaSemana { get; set; }

        [Required]
        public TimeSpan HoraInicio { get; set; }

        [Required]
        public TimeSpan HoraFin { get; set; }

        // Duración por slot en minutos
        [Range(10, 240)]
        public int DuracionMinutos { get; set; } = 30;
    }
}