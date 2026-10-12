using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GolAhora.Actividades
{
    // Hereda de Actividad y es abstracta (se instancian Torneos o Ligas)
    public abstract class Competicion : Actividad
    {
        // entity framework

        // relacion con reglamento
        [Required]
        public int IdReglamento { get; set; }

        [ForeignKey("IdReglamento")]
        public Reglamento ReglamentoCompeticion { get; set; } //

        // relacion con los equipos inscriptos
        public List<Equipo> Equipos { get; set; } = new List<Equipo>(); //


        // constructores
        
        protected Competicion() : base() { }

        protected Competicion(string nombreActividad) : base(nombreActividad) { }


        // logica de negocio

        public void ComenzarInscripcion()
        {
            
        }

        public void CerrarInscripcion()
        {
            
        }

        public void IniciarCompeticion()
        {
            
        }

        public void FinalizarCompeticion()
        {
            
        }

        public void AsignarReglamento(Reglamento nuevoReglamento) //
        {
            this.ReglamentoCompeticion = nuevoReglamento;
            this.IdReglamento = nuevoReglamento.IdReglamento;
        }

        public void CambiarReglamento(Reglamento nuevoReglamento) //
        {
            // Puede invocar al mismo método o tener lógica de validación extra
            AsignarReglamento(nuevoReglamento);
        }

        
        public abstract Equipo ObtenerCampeon(); // obligamos a los hijos a programar este metodo
                                                //porque liga y torneo lo hacen distinto
    }
}