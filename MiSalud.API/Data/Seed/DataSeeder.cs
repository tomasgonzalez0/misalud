using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MiSalud.API.Models;

namespace MiSalud.API.Data.Seed
{
    public static class DataSeeder
    {
        // Contraseñas demo (cambia en producción)
        private const string DefaultMedicoPassword = "Medico123!";
        private const string DefaultPacientePassword = "Paciente123!";

        public static async Task SeedAsync(IServiceProvider services, ILogger logger)
        {
            using var scope = services.CreateScope();
            var sp = scope.ServiceProvider;

            var context = sp.GetRequiredService<ApplicationDbContext>();
            var userMgr = sp.GetRequiredService<UserManager<IdentityUser>>();
            var roleMgr = sp.GetRequiredService<RoleManager<IdentityRole>>();

            await context.Database.MigrateAsync();

            // 1. Roles
            string[] roles = { "Admin", "Paciente", "Medico", "Secretaria" };
            foreach (var r in roles)
            {
                if (!await roleMgr.RoleExistsAsync(r))
                {
                    await roleMgr.CreateAsync(new IdentityRole(r));
                    logger.LogInformation("Rol {Rol} creado", r);
                }
            }

            // 2. Médicos (si ya existen, no repetimos)
            if (!await context.Medicos.AnyAsync())
            {
                var medicosSeed = new (string Nombre, string Email, string RegistroId, string Especialidad)[]
                {
                    ("Dra. Ana López",    "ana.lopez@demo.med",    "MED1001", "Cardiología"),
                    ("Dr. Carlos Mejía",  "carlos.mejia@demo.med", "MED1002", "Dermatología"),
                    ("Dr. Diego Ramírez", "diego.ramirez@demo.med","MED1003", "Pediatría"),
                    ("Dra. Laura Gómez",  "laura.gomez@demo.med",  "MED1004", "Neurología"),
                    ("Dr. Pedro Sánchez", "pedro.sanchez@demo.med","MED1005", "Medicina General")
                };

                foreach (var m in medicosSeed)
                {
                    var user = await userMgr.FindByEmailAsync(m.Email);
                    if (user == null)
                    {
                        user = new IdentityUser
                        {
                            UserName = m.Email,
                            Email = m.Email,
                            EmailConfirmed = true
                        };
                        var createRes = await userMgr.CreateAsync(user, DefaultMedicoPassword);
                        if (!createRes.Succeeded)
                        {
                            logger.LogError("Error creando usuario médico {Email}: {Err}", m.Email,
                                string.Join("; ", createRes.Errors.Select(e => e.Description)));
                            continue;
                        }
                        await userMgr.AddToRoleAsync(user, "Medico");
                    }

                    if (!await context.Medicos.AnyAsync(x => x.Email == m.Email))
                    {
                        context.Medicos.Add(new Medico
                        {
                            Nombre = m.Nombre,
                            Email = m.Email,
                            RegistroId = m.RegistroId,
                            Direccion = "Consultorio Principal",
                            Telefono = "3000001111",
                            Especialidad = m.Especialidad,
                            UserId = user.Id
                        });
                    }
                }
                await context.SaveChangesAsync();
                logger.LogInformation("Médicos sembrados.");
            }

            // 3. Disponibilidades (patrón semanal)
            // Tu modelo define DiaSemana (0=Domingo ... 6=Sábado), HoraInicio, HoraFin, DuracionMinutos.
            if (!await context.DisponibilidadesMedico.AnyAsync())
            {
                var medicos = await context.Medicos.Select(m => m.Id).ToListAsync();

                foreach (var medicoId in medicos)
                {
                    // Ejemplo: Lunes(1) a Viernes(5) de 08:00 a 12:00 cada 30 min
                    for (int dia = 1; dia <= 5; dia++)
                    {
                        context.DisponibilidadesMedico.Add(new DisponibilidadMedico
                        {
                            MedicoId = medicoId,
                            DiaSemana = dia,
                            HoraInicio = TimeSpan.FromHours(8),
                            HoraFin = TimeSpan.FromHours(12),
                            DuracionMinutos = 30
                        });
                    }
                }
                await context.SaveChangesAsync();
                logger.LogInformation("Disponibilidades semanales creadas.");
            }

            // 4. Paciente demo
            const string pacienteEmail = "paciente.demo@misalud.test";
            const string pacienteRegistroId = "PAC1001";

            var pacienteUser = await userMgr.FindByEmailAsync(pacienteEmail);
            if (pacienteUser == null)
            {
                pacienteUser = new IdentityUser
                {
                    UserName = pacienteEmail,
                    Email = pacienteEmail,
                    EmailConfirmed = true
                };
                var res = await userMgr.CreateAsync(pacienteUser, DefaultPacientePassword);
                if (!res.Succeeded)
                {
                    logger.LogError("Error creando usuario paciente demo: {Err}",
                        string.Join("; ", res.Errors.Select(e => e.Description)));
                }
                else
                {
                    await userMgr.AddToRoleAsync(pacienteUser, "Paciente");
                }
            }

            if (!await context.Pacientes.AnyAsync(p => p.Email == pacienteEmail))
            {
                context.Pacientes.Add(new Paciente
                {
                    Nombre = "Paciente Demo",
                    Email = pacienteEmail,
                    RegistroId = pacienteRegistroId,
                    Direccion = "Calle Demo 123",
                    Telefono = "3011112222",
                    UserId = pacienteUser.Id
                });
                await context.SaveChangesAsync();
                logger.LogInformation("Paciente demo creado.");
            }

            logger.LogInformation("Seed finalizado.");
        }
    }
}