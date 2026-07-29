using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GolAhora.Actividades
{
    public class Fecha
    {
        [Key]
        public int IdFecha { get; set; }

        [Required]
        public int NumeroFecha { get; set; } 
        
        public bool EstaFinalizada { get; set; } = false;

        //Entity framework
        [Required]
        public int IdLiga { get; set; }

        [ForeignKey("IdLiga")]
        public Liga LigaCorrespondiente { get; set; }

        // relacion uno a muchos con partidos, una fecha tiene muchos partidos
        public List<Partido> Partidos { get; set; } = new List<Partido>();


        // constructores

        public Fecha() { }

        public Fecha(int numeroFecha, int idLiga)
        {
            this.NumeroFecha = numeroFecha;
            this.IdLiga = idLiga;
        }

        // logica de negocio

        public void AgregarPartido(Partido nuevoPartido)
        {
            if (!Partidos.Contains(nuevoPartido))
            {
                Partidos.Add(nuevoPartido);
            }
        }

        public void FinalizarFecha()
        {
            this.EstaFinalizada = true;
        }
    }
}