using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GolAhora.Usuarios; 

namespace GolAhora.Actividades
{
    public class Entrenamiento : Actividad
    {
        [Required]
        [StringLength(255)]
        public string Descripcion { get; set; }

        // Relaciones del Entity Framework
        
        [Required]
        public int DniEntrenador { get; set; }

        [ForeignKey("DniEntrenador")]
        public Entrenador EntrenadorEncargado { get; set; }

        public List<Cliente> AlumnosInscriptos { get; set; } = new List<Cliente>();
        // Constructores

        public Entrenamiento() : base() { }

        public Entrenamiento(string nombre, string descripcion, int dniEntrenador) : base(nombre)
        {
            this.Descripcion = descripcion;
            this.DniEntrenador = dniEntrenador;
        }

        // logica de negocio

        public void ModificarDescripcion(string nuevaDescripcion)
        {
            this.Descripcion = nuevaDescripcion;
        }

        public void InscribirAlumno(Cliente nuevoAlumno)
        {
            // A diferencia de la clase, asumimos que el entrenamiento no tiene cupo límite estricto
            if (!AlumnosInscriptos.Contains(nuevoAlumno))
            {
                AlumnosInscriptos.Add(nuevoAlumno);
            }
        }
    }
}