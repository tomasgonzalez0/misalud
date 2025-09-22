namespace MiSalud.API.Services.Interfaces
{
    public interface INotificationService
    {
        Task EnviarConfirmacionAsync(MiSalud.API.Models.Cita cita, CancellationToken ct = default);
        Task EnviarRecordatorioAsync(MiSalud.API.Models.Cita cita, CancellationToken ct = default);
    }
}