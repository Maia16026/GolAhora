using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace GolAhora.Usuarios
{
    public class Entrenador: Instructor
    {

        public Entrenador() 
        {
        }

        public Entrenador(int dni,
           string nombre,
           string apellido,
           Direccion direccion,
           int telefono,
           string mail,
           string contraseña,
           string especialidad,
           Certificado certificado,
           int antiguedad) :

           base(dni, nombre, apellido, direccion,
                 telefono, mail, contraseña, especialidad, certificado, antiguedad)
        {
        }


    }
}
