using System.ComponentModel.DataAnnotations;

namespace GolAhora.Reservas
{
    public class Descuento
    {
        [Key]
        public int IdDescuento { get; set; } 

        [Required]
        [StringLength(100)]
        public string Caso { get; set; } // el motivo del descuento

        [Required]
        public double Valor { get; set; } // monto a restar

        // constructoresss

        public Descuento() { }

        public Descuento(string caso, double valor)
        {
            this.Caso = caso;
            this.Valor = valor;
        }

        // logica de negocio

        public void ActualizarValor(double nuevoValor)
        {
            this.Valor = nuevoValor;
        }
    }
}