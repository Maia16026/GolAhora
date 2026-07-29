using Microsoft.EntityFrameworkCore;
using GolAhora.Usuarios;
using GolAhora.Actividades;
using GolAhora.Reservas;

namespace GolAhora
{
    public class GolContext : DbContext
    {
        public GolContext() { }

        public GolContext(DbContextOptions<GolContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Administrador> Administradores { get; set; }
        public DbSet<Instructor> Instructores { get; set; }
        public DbSet<Entrenador> Entrenadores { get; set; }
        public DbSet<Profesor> Profesores { get; set; }
        public DbSet<Direccion> Direcciones { get; set; }
        public DbSet<Certificado> Certificados { get; set; }
        public DbSet<Cancha> Canchas { get; set; }
        public DbSet<TipoCancha> TipoCanchas { get; set; }
        public DbSet<Reserva> Reservas { get; set; }
        public DbSet<Actividad> Actividades { get; set; }
        public DbSet<Entrenamiento> Entrenamientos { get; set; }
        public DbSet<Clase> Clases { get; set; }
        public DbSet<Competicion> Competiciones { get; set; }
        public DbSet<Torneo> Torneos { get; set; }
        public DbSet<Liga> Ligas { get; set; }
        public DbSet<Equipo> Equipos { get; set; }

        public DbSet<Jugador> Jugadores { get; set; } 
        
        public DbSet<Partido> Partidos { get; set; }
        public DbSet<Cobro> Cobros { get; set; }
        public DbSet<Recibo> Recibos { get; set; }
        public DbSet<Descuento> Descuentos { get; set; }
        public DbSet<Reglamento> Reglamentos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // usuarios
            modelBuilder.Entity<Cliente>().ToTable("Clientes");
            modelBuilder.Entity<Administrador>().ToTable("Administradores");
            modelBuilder.Entity<Instructor>().ToTable("Instructores");
            modelBuilder.Entity<Entrenador>().ToTable("Entrenadores");
            modelBuilder.Entity<Profesor>().ToTable("Profesores");

            // actividades
            modelBuilder.Entity<Entrenamiento>().ToTable("Entrenamientos");
            modelBuilder.Entity<Clase>().ToTable("Clases");
            modelBuilder.Entity<Competicion>().ToTable("Competiciones");
            modelBuilder.Entity<Torneo>().ToTable("Torneos");
            modelBuilder.Entity<Liga>().ToTable("Ligas");

            // relacion 1 a 1 usuario direccion
            modelBuilder.Entity<Usuario>()
                .HasOne(u => u.direccion_) 
                .WithOne(d => d.Usuario)
                .HasForeignKey<Direccion>(d => d.DniUsuario)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Equipo>()
                .HasMany(e => e.Jugadores)
                .WithOne(j => j.EquipoAsociado)
                .HasForeignKey(j => j.IdEquipo)
                .OnDelete(DeleteBehavior.Cascade); 

            // PK del usuario no es autoincremental
            modelBuilder.Entity<Usuario>()
                .Property(u => u.Dni)
                .ValueGeneratedNever();

            // relacion cancha TipoCancha
            modelBuilder.Entity<Cancha>()
                .HasOne(c => c.TipoDeCancha)
                .WithMany(tc => tc.Canchas)
                .HasForeignKey(c => c.IdTipoCancha);
        }
    }
}