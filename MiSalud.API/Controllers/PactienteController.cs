using Microsoft.AspNetCore.Mvc;
using MiSalud.API.Models;
using MiSalud.API.Services.Interfaces;

namespace MiSalud.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PacientesController : ControllerBase
    {
        private readonly IPacienteService _service;

        public PacientesController(IPacienteService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var pacientes = await _service.GetAllAsync();
            return Ok(pacientes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var paciente = await _service.GetByIdAsync(id);
            return paciente != null ? Ok(paciente) : NotFound();
        }

        [HttpGet("buscar/{cedula}")]
        public async Task<IActionResult> GetByCedula(string cedula)
        {
            var paciente = await _service.GetByCedulaAsync(cedula);
            return paciente != null ? Ok(paciente) : NotFound();
        }

        [HttpPost]
        [HttpPost]
        public async Task<IActionResult> Create(Paciente paciente)
        {
            try
            {
                var nuevo = await _service.CreateAsync(paciente);
                return CreatedAtAction(nameof(GetById), new { id = nuevo.Id }, nuevo);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message,
                    field = "registroId"
                });
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Paciente paciente)
        {
            if (id != paciente.Id) return BadRequest();
            var actualizado = await _service.UpdateAsync(paciente);
            return actualizado ? NoContent() : NotFound();
        }
    }
}
