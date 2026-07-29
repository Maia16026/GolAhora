using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GolAhora.Reservas; 

namespace GolAhora.Actividades
{
    public class Partido
    {
        [Key]
        public int IdPartido { get; set; }

        // entity framework

        // equipo local y equipo visitante
        [Required]
        public int IdEquipoLocal { get; set; }
        
        [ForeignKey("IdEquipoLocal")]
        public Equipo Local { get; set; }

        [Required]
        public int IdEquipoVisitante { get; set; }
        
        [ForeignKey("IdEquipoVisitante")]
        public Equipo Visitante { get; set; }


        // relacion con cancha
        // Se usa int? (anulable) por si el partido se crea pero aún no se reservó la cancha
        public int? IdCancha { get; set; } 
        
        [ForeignKey("IdCaching")]
        public Cancha? CanchaAsignada { get; set; }


        // relaciones con liga/torneo que son los padres
        // Como un partido puede pertenecer a una Fecha (Liga) O a un Torneo (Llaves),
        // ambas claves foráneas deben ser anulables.
        public int? IdFecha { get; set; }
        
        [ForeignKey("IdFecha")]
        public Fecha FechaCorrespondiente { get; set; }

        public int? IdTorneo { get; set; }
        
        [ForeignKey("IdTorneo")]
        public Torneo TorneoCorrespondiente { get; set; }


        // atributos propios

        public int? GolesLocal { get; set; } = 0; 
        
        public int? GolesVisitante { get; set; } = 0; 
        
        public string Estado { get; set; } = "Programado";

        // ¡NUEVO! Propiedad necesaria para organizar las llaves eliminatorias del torneo
        public int Ronda { get; set; } = 1; 


        // constructores

        public Partido() { }

        public Partido(int idEquipoLocal, int idEquipoVisitante)
        {
            this.IdEquipoLocal = idEquipoLocal;
            this.IdEquipoVisitante = idEquipoVisitante;
        }


        // logica de negocio

        public void EstablecerResultado(int golesLocal, int golesVisitante)
        {
            this.GolesLocal = golesLocal;
            this.GolesVisitante = golesVisitante;
            this.Estado = "Finalizado";
        }

        public void SuspenderPartido() 
        {
            this.Estado = "Suspendido";
        }

        public Equipo ObtenerGanador() 
        {
            if (Estado != "Finalizado") return null;

            if (GolesLocal > GolesVisitante)
            {
                return Local;
            }
            else if (GolesVisitante > GolesLocal)
            {
                return Visitante;
            }
            
            return null; // En caso de empate devuelve null (tenemos que ver si hay penales o no, pero ya es muy complejo)
        }
    }
}