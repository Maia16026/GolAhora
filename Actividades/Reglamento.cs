using System.ComponentModel.DataAnnotations;

namespace GolAhora.Actividades
{
    public class Reglamento
    {
        [Key]
        public int IdReglamento { get; set; } 

        [Required]
        public string TipoReglamento { get; set; } 

        public int PuntosPorVictoria { get; set; } 

        public int PuntosPorEmpate { get; set; } 

        public int MaximaFaltasPorJugador { get; set; } 

        public int CantidadCambios { get; set; } 

        // constructores

        public Reglamento() { }

        public Reglamento(string tipo, int ptsVictoria, int ptsEmpate, int maxFaltas, int cambios)
        {
            this.TipoReglamento = tipo;
            this.PuntosPorVictoria = ptsVictoria;
            this.PuntosPorEmpate = ptsEmpate;
            this.MaximaFaltasPorJugador = maxFaltas;
            this.CantidadCambios = cambios;
        }

        // logica de negocio
        public void ActualizarReglas(int ptsV, int ptsE, int maxF, int cambios)
        {
            this.PuntosPorVictoria = ptsV;
            this.PuntosPorEmpate = ptsE;
            this.MaximaFaltasPorJugador = maxF;
            this.CantidadCambios = cambios;
        }
    }
}