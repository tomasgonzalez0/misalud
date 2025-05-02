using MiSalud.API.Data;
using MiSalud.API.Models;
using MiSalud.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MiSalud.API.Services.Implementations
{
    public class PacienteService : IPacienteService
    {
        private readonly ApplicationDbContext _context;

        public PacienteService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Paciente>> GetAllAsync()
        {
            return await _context.Pacientes.ToListAsync();
        }

        public async Task<Paciente?> GetByIdAsync(int id)
        {
            return await _context.Pacientes.FindAsync(id);
        }

        public async Task<Paciente?> GetByCedulaAsync(string cedula)
        {
            return await _context.Pacientes.FirstOrDefaultAsync(p => p.RegistroId == cedula);
        }

        public async Task<Paciente> CreateAsync(Paciente paciente)
        {
            var existente = await _context.Pacientes
                .FirstOrDefaultAsync(p => p.RegistroId == paciente.RegistroId);

            if (existente != null)
            {
                throw new InvalidOperationException("Ya existe un paciente con ese número de cédula.");
            }

            _context.Pacientes.Add(paciente);
            await _context.SaveChangesAsync();
            return paciente;
        }


        public async Task<bool> UpdateAsync(Paciente paciente)
        {
            var existente = await _context.Pacientes.FindAsync(paciente.Id);
            if (existente == null) return false;

            existente.Nombre = paciente.Nombre;
            existente.Direccion = paciente.Direccion;
            existente.Email = paciente.Email;
            existente.Telefono = paciente.Telefono;
            existente.RegistroId = paciente.RegistroId;
            existente.Password = paciente.Password;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
