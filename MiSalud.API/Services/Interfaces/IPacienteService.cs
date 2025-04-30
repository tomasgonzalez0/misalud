using MiSalud.API.Models;

namespace MiSalud.API.Services.Interfaces
{
    public interface IPacienteService
    {
        Task<List<Paciente>> GetAllAsync();
        Task<Paciente?> GetByIdAsync(int id);
        Task<Paciente?> GetByCedulaAsync(string cedula);
        Task<Paciente> CreateAsync(Paciente paciente);
        Task<bool> UpdateAsync(Paciente paciente);
    }
}
