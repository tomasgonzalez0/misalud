using MiSalud.API.DTOs.Citas;

namespace MiSalud.API.Services.Interfaces
{
    public interface IAvailabilityService
    {
        // Devuelve los slots disponibles del médico para una fecha dada
        Task<IReadOnlyList<DisponibilidadSlotDto>> GetDoctorAvailabilityAsync(
            int medicoId, DateTime fecha, int timeZoneOffsetMinutes, CancellationToken ct);

        // Valida un slot específico y devuelve el rango de tiempo local calculado o el motivo si no es válido
        Task<(DateTime startLocal, DateTime endLocal, string? reasonIfInvalid)> ValidateAndResolveSlotAsync(
            int medicoId, DateTime startLocal, int? slotMinutes, int timeZoneOffsetMinutes, CancellationToken ct);
    }
}