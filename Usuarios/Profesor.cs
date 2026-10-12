using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using GolAhora.Actividades;

namespace GolAhora.Usuarios
{
    public class Profesor: Instructor
    {

        public Profesor()
        {
        }

        public Profesor(int dni,
            string nombre,
            string apellido,
            Direccion direccion,
            int telefono,
            string mail,
            string contraseña,
            string especialidad,
            Certificado certificado,
            int antiguedad):

            base  (dni, nombre, apellido, direccion,
                  telefono, mail, contraseña, especialidad,certificado,antiguedad)
        {
        }

        public void registrarAsistClase (Clase clase)
        {

        }

        public void anularASistClase(Clase clase) { }

    }
}
