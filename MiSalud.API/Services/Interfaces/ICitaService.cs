using MiSalud.API.DTOs.Citas;
using MiSalud.API.Models;

namespace MiSalud.API.Services.Interfaces
{
    public interface ICitaService
    {
        Task<Cita> CrearAsync(CrearCitaRequest request, CancellationToken ct);
        Task<Cita?> GetByIdAsync(int id, CancellationToken ct);

        Task<IReadOnlyList<string>> GetEspecialidadesAsync(CancellationToken ct);
        Task<IReadOnlyList<MedicoListadoDto>> GetMedicosPorEspecialidadAsync(string especialidad, CancellationToken ct);
        Task<IReadOnlyList<string>> GetDisponibilidadAsync(int medicoId, DateOnly fecha, CancellationToken ct);
        Task<CitaPreviewResponse> PreviewAsync(CitaPreviewRequest request, CancellationToken ct);
    }
}