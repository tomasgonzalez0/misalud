using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MiSalud.API.Models;
using System.Reflection;

namespace MiSalud.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Persona> Personas { get; set; } = default!;
        public DbSet<Paciente> Pacientes { get; set; } = default!;
        public DbSet<Medico> Medicos { get; set; } = default!;
        public DbSet<Secretaria> Secretarias { get; set; } = default!;
        public DbSet<Cita> Citas { get; set; } = default!;
        public DbSet<HistoriaClinica> HistoriasClinicas { get; set; } = default!;
        public DbSet<Diagnostico> Diagnosticos { get; set; } = default!;
        public DbSet<Formula> Formulas { get; set; } = default!;
        public DbSet<Medicamento> Medicamentos { get; set; } = default!;
        public DbSet<DisponibilidadMedico> DisponibilidadesMedico { get; set; } = default!;

        // Converters (útiles para EF Core 7 / retrocompatibilidad)
        private static readonly ValueConverter<DateOnly, DateTime> _dateOnlyConverter =
            new(v => v.ToDateTime(TimeOnly.MinValue),
                v => DateOnly.FromDateTime(v));

        private static readonly ValueConverter<TimeOnly, TimeSpan> _timeOnlyConverter =
            new(v => v.ToTimeSpan(),
                v => TimeOnly.FromTimeSpan(v));

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Persona>(b =>
            {
                b.HasIndex(p => p.RegistroId).IsUnique();
                b.HasOne<IdentityUser>()
                    .WithMany()
                    .HasForeignKey(p => p.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

            });

            modelBuilder.Entity<Cita>(b =>
            {
                // Conversión DateOnly -> date
                b.Property(c => c.Fecha)
                    .HasConversion(_dateOnlyConverter)
                    .HasColumnType("date");

                // Conversión TimeOnly -> time
                b.Property(c => c.Hora)
                    .HasConversion(_timeOnlyConverter)
                    .HasColumnType("time(0)");

                b.Property(c => c.Estado)
                    .HasMaxLength(30)
                    .HasDefaultValue("Programada");

                b.Property(c => c.Motivo)
                    .HasMaxLength(500);

                b.HasOne(c => c.Paciente)
                    .WithMany(p => p.Citas!)
                    .HasForeignKey(c => c.PacienteId)
                    .OnDelete(DeleteBehavior.Restrict);

                b.HasOne(c => c.Medico)
                    .WithMany(m => m.Citas!)
                    .HasForeignKey(c => c.MedicoId)
                    .OnDelete(DeleteBehavior.Restrict);

                b.HasIndex(c => new { c.MedicoId, c.Fecha, c.Hora })
                    .IsUnique();
            });

            modelBuilder.Entity<DisponibilidadMedico>(b =>
            {
                b.HasOne(d => d.Medico)
                    .WithMany(m => m.Disponibilidades!)
                    .HasForeignKey(d => d.MedicoId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.Property(d => d.HoraInicio)
                    .HasColumnType("time(0)");
                b.Property(d => d.HoraFin)
                    .HasColumnType("time(0)");
                b.Property(d => d.DuracionMinutos)
                    .HasDefaultValue(30);

            });

            modelBuilder.Entity<HistoriaClinica>(b =>
            {

                if (b.Metadata.FindProperty("PacienteId") != null)
                {
                    b.HasOne(typeof(Paciente))
                        .WithMany()
                        .HasForeignKey("PacienteId")
                        .OnDelete(DeleteBehavior.Restrict);
                }
            });

            modelBuilder.Entity<Diagnostico>(b =>
            {
                b.Property(d => d.Nombre).HasMaxLength(200);
            });

            modelBuilder.Entity<Formula>(b =>
            {
                b.Property(f => f.Indicaciones).HasMaxLength(1000);
            });

            modelBuilder.Entity<Medicamento>(b =>
            {
                b.Property(m => m.Nombre).HasMaxLength(200);
            });

            modelBuilder.Entity<Diagnostico>()
                .HasMany(d => d.HistoriasClinicas)
                .WithMany(h => h.Diagnosticos)
                .UsingEntity<Dictionary<string, object>>(
                    "DiagnosticoHistoriaClinica",
                    join => join
                        .HasOne<HistoriaClinica>()
                        .WithMany()
                        .HasForeignKey("HistoriaClinicaId")
                        .OnDelete(DeleteBehavior.Restrict),
                    join => join
                        .HasOne<Diagnostico>()
                        .WithMany()
                        .HasForeignKey("DiagnosticoId")
                        .OnDelete(DeleteBehavior.Restrict),
                    join =>
                    {
                        join.HasKey("DiagnosticoId", "HistoriaClinicaId");
                        join.ToTable("DiagnosticoHistoriaClinica");
                    });

            modelBuilder.Entity<Formula>()
                .HasMany(f => f.HistoriasClinicas)
                .WithMany(h => h.Formulas)
                .UsingEntity<Dictionary<string, object>>(
                    "FormulaHistoriaClinica",
                    join => join
                        .HasOne<HistoriaClinica>()
                        .WithMany()
                        .HasForeignKey("HistoriaClinicaId")
                        .OnDelete(DeleteBehavior.Restrict),
                    join => join
                        .HasOne<Formula>()
                        .WithMany()
                        .HasForeignKey("FormulaId")
                        .OnDelete(DeleteBehavior.Restrict),
                    join =>
                    {
                        join.HasKey("FormulaId", "HistoriaClinicaId");
                        join.ToTable("FormulaHistoriaClinica");
                    });

            modelBuilder.Entity<Formula>()
                .HasMany(f => f.Medicamentos)
                .WithMany(m => m.Formulas)
                .UsingEntity<Dictionary<string, object>>(
                    "FormulaMedicamento",
                    join => join
                        .HasOne<Medicamento>()
                        .WithMany()
                        .HasForeignKey("MedicamentoId")
                        .OnDelete(DeleteBehavior.Restrict),
                    join => join
                        .HasOne<Formula>()
                        .WithMany()
                        .HasForeignKey("FormulaId")
                        .OnDelete(DeleteBehavior.Restrict),
                    join =>
                    {
                        join.HasKey("FormulaId", "MedicamentoId");
                        join.ToTable("FormulaMedicamento");
                    });

        }
    }
}