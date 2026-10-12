using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GolAhora.Reservas
{
    public class Cobro
    {
        [Key]
        public int IdCobro { get; set; } // 

        [Required]
        public DateTime Fecha { get; set; } // 

        [Required]
        public double MontoBase { get; set; } // 

        [Required]
        [StringLength(150)]
        public string Concepto { get; set; } // 

        [Required]
        [StringLength(50)]
        public string Estado { get; set; } = "Pendiente"; // 

        public double MontoFinal { get; set; } // 


        // entity framework

        // relacion con descuento
        public int? IdDescuento { get; set; }
        
        [ForeignKey("IdDescuento")]
        public Descuento DescuentoAplicado { get; set; } // 

        // relacion 1 a 1 con recibo
        public int? IdRecibo { get; set; }
        
        [ForeignKey("IdRecibo")]
        public Recibo ReciboEmitido { get; set; } // 


        // constructores

        public Cobro() { }

        public Cobro(double montoBase, string concepto)
        {
            this.Fecha = DateTime.Now;
            this.MontoBase = montoBase;
            this.Concepto = concepto;
            this.Estado = "Pendiente";
            this.MontoFinal = montoBase; // Por defecto es igual al base hasta que se calcule el descuento
        }


        // logica de negocio

        public void CalcularTotal()  
        {
            if (DescuentoAplicado != null)
            {
                // Restamos el valor del descuento al monto base
                this.MontoFinal = this.MontoBase - DescuentoAplicado.Valor; 
            }
            else
            {
                this.MontoFinal = this.MontoBase;
            }
        }

        public bool ValidarPago() 
        {
            return this.Estado == "Pagado";
        }

        public void AnularCobro() 
        {
            this.Estado = "Anulado";
            this.MontoFinal = 0;
        }
    }
}