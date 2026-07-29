using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GolAhora.Usuarios; 

namespace GolAhora.Actividades
{
    public class Clase : Actividad
    {
        [Required]
        public int CupoMaximo { get; set; }

        public string Dias { get; set; }
        public string Horario { get; set; }

        [Required]
        public int DniProfesor { get; set; }

        // 1. Agregamos el ? después de Profesor
        [ForeignKey("DniProfesor")]
        public Profesor? ProfesorEncargado { get; set; }

        // 2. Agregamos el ? después de List<Cliente>
        public List<Cliente>? AlumnosInscriptos { get; set; } = new List<Cliente>();

        

        // Constructores
        public Clase() : base() { }

        public Clase(string nombre, int cupo, int dniProfesor) : base(nombre)
        {
            this.CupoMaximo = cupo;
            this.DniProfesor = dniProfesor;
        }
        
        
        public bool HayCupoDisponible() 
        {
            return AlumnosInscriptos.Count < CupoMaximo;
        }

        public void InscribirAlumno(Cliente nuevoAlumno)
        {
            if (HayCupoDisponible() && !AlumnosInscriptos.Contains(nuevoAlumno))
            {
                AlumnosInscriptos.Add(nuevoAlumno);
            }
        }
    }
}
