namespace MiSalud.API.DTOs.Citas
{
    public class DisponibilidadSlotDto
    {
        public DateOnly Fecha { get; set; }        
        public TimeOnly HoraInicio { get; set; }
        public TimeOnly HoraFin { get; set; }
        public bool Disponible { get; set; }
    }
}