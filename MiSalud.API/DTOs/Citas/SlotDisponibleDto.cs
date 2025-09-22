namespace MiSalud.API.DTOs.Citas
{
    public class SlotDisponibleDto
    {
        public string Hora { get; set; } = string.Empty;
        public bool Disponible { get; set; }
    }
}