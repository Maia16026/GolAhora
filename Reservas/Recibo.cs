using System;
using System.ComponentModel.DataAnnotations;

namespace GolAhora.Reservas
{
    public class Recibo
    {
        [Key]
        public int IdRecibo { get; set; } 

        [Required]
        public DateTime Fecha { get; set; } 

        [Required]
        public double Monto { get; set; } 

        // constructores

        public Recibo() { }

        public Recibo(double monto)
        {
            this.Fecha = DateTime.Now;
            this.Monto = monto;
        }

        // logica de negocio

        // el metodo imprimirRecibo() del UML ahora sería una lógica de exportacion a pdf
        public string ObtenerResumen()
        {
            return $"Recibo #{IdRecibo} - Fecha: {Fecha.ToShortDateString()} - Total: ${Monto}";
        }
    }

}