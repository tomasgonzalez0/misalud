namespace MiSalud.API.Models
{
    public class Formula
    {
        public int Id { get; set; }
        public string Descripcion { get; set; }
        public DateTime Fecha { get; set; }

        public int MedicoId { get; set; }
    }
}
