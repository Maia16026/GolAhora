using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GolAhora.Actividades
{
    public abstract class Actividad
    {
        [Key]
        public int IdActividad { get; set; } // 

        [Required]
        [StringLength(100)]
        public string NombreActividad { get; set; } // 
        protected Actividad() { }

        protected Actividad(string nombre)
        {
            NombreActividad = nombre;
        }
    }
}