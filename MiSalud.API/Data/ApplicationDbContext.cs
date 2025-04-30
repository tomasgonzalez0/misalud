using Microsoft.EntityFrameworkCore;
using MiSalud.API.Models;

namespace MiSalud.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Persona> Personas { get; set; }
        public DbSet<Paciente> Pacientes { get; set; }
        public DbSet<Medico> Medicos { get; set; }
        public DbSet<Secretaria> Secretarias { get; set; }
        public DbSet<Cita> Citas { get; set; }
        public DbSet<HistoriaClinica> HistoriasClinicas { get; set; }
        public DbSet<Diagnostico> Diagnosticos { get; set; }
        public DbSet<Formula> Formulas { get; set; }
        public DbSet<Medicamento> Medicamentos { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Restricciones en Cita
            modelBuilder.Entity<Cita>()
                .HasOne(c => c.Paciente)
                .WithMany(p => p.Citas)
                .HasForeignKey(c => c.PacienteId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Cita>()
                .HasOne(c => c.Medico)
                .WithMany(m => m.Citas)
                .HasForeignKey(c => c.MedicoId)
                .OnDelete(DeleteBehavior.Restrict);

            // Diagnostico ↔ HistoriaClinica
            modelBuilder.Entity<Diagnostico>()
                .HasMany(d => d.HistoriasClinicas)
                .WithMany(h => h.Diagnosticos)
                .UsingEntity<Dictionary<string, object>>(
                    "DiagnosticoHistoriaClinica",
                    j => j
                        .HasOne<HistoriaClinica>()
                        .WithMany()
                        .HasForeignKey("HistoriasClinicasId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j => j
                        .HasOne<Diagnostico>()
                        .WithMany()
                        .HasForeignKey("DiagnosticosId")
                        .OnDelete(DeleteBehavior.Restrict));

            // Formula ↔ HistoriaClinica
            modelBuilder.Entity<Formula>()
                .HasMany(f => f.HistoriasClinicas)
                .WithMany(h => h.Formulas)
                .UsingEntity<Dictionary<string, object>>(
                    "FormulaHistoriaClinica",
                    j => j
                        .HasOne<HistoriaClinica>()
                        .WithMany()
                        .HasForeignKey("HistoriaClinicaId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j => j
                        .HasOne<Formula>()
                        .WithMany()
                        .HasForeignKey("FormulaId")
                        .OnDelete(DeleteBehavior.Restrict));

            // Formula ↔ Medicamento
            modelBuilder.Entity<Formula>()
                .HasMany(f => f.Medicamentos)
                .WithMany(m => m.Formulas)
                .UsingEntity<Dictionary<string, object>>(
                    "FormulaMedicamento",
                    j => j
                        .HasOne<Medicamento>()
                        .WithMany()
                        .HasForeignKey("MedicamentoId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j => j
                        .HasOne<Formula>()
                        .WithMany()
                        .HasForeignKey("FormulaId")
                        .OnDelete(DeleteBehavior.Restrict));
        }




    }
}
