using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GolAhora.Actividades
{
    public class RegistroTabla
    {
        [Key]
        public int IdTabla { get; set; } 

        public int Posicion { get; set; } 

        // entity framework
        [Required]
        public int IdLiga { get; set; }
        
        [ForeignKey("IdLiga")]
        public Liga LigaCorrespondiente { get; set; }

        [Required]
        public int IdEquipo { get; set; }

        [ForeignKey("IdEquipo")]
        public Equipo EquipoAsociado { get; set; } 

        // --- ESTADÍSTICAS ---
        public int Puntos { get; set; } = 0; 
        
        // AGREGADOS NUEVOS
        public int PartidosJugados { get; set; } = 0;
        public int PartidosGanados { get; set; } = 0;
        public int PartidosEmpatados { get; set; } = 0;
        public int PartidosPerdidos { get; set; } = 0;

        // Mantengo tus nombres originales para que no rompa nada
        public int GolesFavor { get; set; } = 0;
        public int GolesContra { get; set; } = 0;

        // constructores
        public RegistroTabla() { }

        public RegistroTabla(int idLiga, int idEquipo)
        {
            this.IdLiga = idLiga;
            this.IdEquipo = idEquipo;
        }

        // logica de negocio
        public void ActualizarEstadisticas(int puntosObtenidos, int golesF, int golesC, string resultado) 
        {
            this.Puntos += puntosObtenidos;
            this.GolesFavor += golesF;
            this.GolesContra += golesC;
            this.PartidosJugados++; // Siempre suma 1 al jugar

            if (resultado == "Victoria") this.PartidosGanados++;
            else if (resultado == "Empate") this.PartidosEmpatados++;
            else if (resultado == "Derrota") this.PartidosPerdidos++;
        }

        public int DiferenciaDeGoles() 
        {
            return this.GolesFavor - this.GolesContra;
        }
    }
}