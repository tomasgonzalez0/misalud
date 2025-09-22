using Microsoft.EntityFrameworkCore;
using MiSalud.API.Data;
using MiSalud.API.Models;
using MiSalud.API.Services.Interfaces;

namespace MiSalud.API.Services.Implementations
{
    public class PacienteService : IPacienteService
    {
        private readonly ApplicationDbContext _db;

        public PacienteService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<List<Paciente>> GetAllAsync()
        {
            return await _db.Pacientes.AsNoTracking().ToListAsync();
        }

        public async Task<Paciente?> GetByIdAsync(int id)
        {
            return await _db.Pacientes.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Paciente?> GetByCedulaAsync(string cedula)
        {
            return await _db.Pacientes.AsNoTracking().FirstOrDefaultAsync(p => p.RegistroId == cedula);
        }

        public async Task<Paciente> CreateAsync(Paciente paciente)
        {
            // Validar unicidad de RegistroId
            var exists = await _db.Personas.AnyAsync(p => p.RegistroId == paciente.RegistroId);
            if (exists)
                throw new InvalidOperationException("Ya existe un paciente con ese RegistroId.");

            // NO tocar contraseñas aquí; las credenciales se manejan con Identity.
            _db.Pacientes.Add(paciente);
            await _db.SaveChangesAsync();
            return paciente;
        }

        public async Task<bool> UpdateAsync(Paciente paciente)
        {
            var current = await _db.Pacientes.FirstOrDefaultAsync(p => p.Id == paciente.Id);
            if (current == null) return false;

            // Campos básicos (sin password)
            current.Nombre = paciente.Nombre;
            current.Email = paciente.Email;
            current.Direccion = paciente.Direccion;
            current.Telefono = paciente.Telefono;
            current.RegistroId = paciente.RegistroId;

            await _db.SaveChangesAsync();
            return true;
        }
    }
}