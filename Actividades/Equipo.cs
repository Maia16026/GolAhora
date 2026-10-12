using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GolAhora.Actividades
{
    public class Equipo
    {
        [Key]
        public int IdEquipo { get; set; }

        [Required]
        [StringLength(100)]
        public string Nombre { get; set; }

        public List<Jugador> Jugadores { get; set; } = new List<Jugador>();

        public List<Competicion> Competiciones { get; set; } = new List<Competicion>();

        public Equipo() { }

        public Equipo(string nombre)
        {
            this.Nombre = nombre;
        }

        public int ObtenerCantidadJugadores()
        {
            return Jugadores != null ? Jugadores.Count : 0;
        }
    }
}