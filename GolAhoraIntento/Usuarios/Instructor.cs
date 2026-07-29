using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GolAhora.Usuarios
{
    public class Instructor : Usuario
    {
        public string Especialidad { get; set; }
        
        public int Antiguedad { get; set; }

        // entity framework
        
        // puede ser null si todavia no presento el certificado
        public int? IdCertificado { get; set; }

        [ForeignKey("IdCertificado")]
        public Certificado Certificado_ { get; set; }

        // Constructores
        public Instructor() : base() { }

        public Instructor(int dni, string nombre, string apellido, Direccion direccion, int telefono, string mail, string contrasena, string especialidad, Certificado certificado, int antiguedad) 
            : base(dni, nombre, apellido, direccion, telefono, mail, contrasena)
        {
            this.Especialidad = especialidad;
            this.Certificado_ = certificado;
            this.Antiguedad = antiguedad;
            
            if(certificado != null)
            {
                this.IdCertificado = certificado.IdCertificado;
            }
        }
    }
}