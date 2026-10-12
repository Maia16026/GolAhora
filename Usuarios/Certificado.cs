using System;
using System.ComponentModel.DataAnnotations;

namespace GolAhora.Usuarios
{
    public class Certificado
    {
        [Key]
        public int IdCertificado { get; set; }

        public string NombreCertificacion { get; set; }
        
        public string EnteEmisor { get; set; }
        
        public bool Verificado { get; set; }
        
        public DateTime FechaEmision { get; set; }
        
        public Certificado() { }

        public Certificado(int idCertificado, string nombreCertificacion, string enteEmisor, bool verificado, DateTime fechaEmision)
        {
            this.IdCertificado = idCertificado;
            this.NombreCertificacion = nombreCertificacion;
            this.EnteEmisor = enteEmisor;
            this.Verificado = verificado;
            this.FechaEmision = fechaEmision;
        }
    }
}