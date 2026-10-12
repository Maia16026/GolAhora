using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GolAhora.Usuarios; 

namespace GolAhora.Reservas
{
    public class Reserva
    {
        [Key]
        public int IdReserva { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        [Required]
        public DateTime Fecha { get; set; }

        [Required]
        public TimeSpan HoraInicio { get; set; }

        [Required]
        public TimeSpan HoraFin { get; set; }

        [Required]
        [StringLength(50)]
        public string EstadoReserva { get; set; } = "Pendiente";

        public string ComprobantePath { get; set; } = ""; // Guarda el nombre del archivo 


        // entity framework

        // relacion con el cliente
        [Required]
        public int DniCliente { get; set; }
        
        [ForeignKey("DniCliente")]
        public Usuario ClienteReserva { get; set; }

        // relacion con la cancha
        [Required]
        public int IdCancha { get; set; }
        
        [ForeignKey("IdCancha")]
        public Cancha CanchaReservada { get; set; }

        // relacion con cobro
        // Es anulable porque la reserva puede crearse antes de procesar el pago
        public int? IdCobro { get; set; }
        
        [ForeignKey("IdCobro")]
        public Cobro CobroAsociado { get; set; }

        // Propiedad calculada útil para validaciones (no se guarda en BD)
        [NotMapped]
        public TimeSpan Duracion => HoraFin - HoraInicio;

        // constructores

        public Reserva() { }

        public Reserva(DateTime fecha, TimeSpan inicio, TimeSpan fin, int dniCliente, int idCancha)
        {
            this.Fecha = fecha;
            this.HoraInicio = inicio;
            this.HoraFin = fin;
            this.DniCliente = dniCliente;
            this.IdCancha = idCancha;
            this.EstadoReserva = "Pendiente";
        }


        // logica de negocio (Actualizada según Requerimientos Funcionales)

        public bool ValidarFechaReserva()
        {
            // RF 24: Verifica que no sea pasada y que no exceda los 30 días de anticipación
            DateTime fechaLimite = DateTime.Now.Date.AddDays(30);
            if (this.Fecha.Date < DateTime.Now.Date || this.Fecha.Date > fechaLimite) return false;
            if (this.Fecha.Date == DateTime.Now.Date && this.HoraInicio < DateTime.Now.TimeOfDay) return false;
            return this.Fecha.Date >= DateTime.Now.Date && this.Fecha.Date <= fechaLimite;
            
        }

        public bool VerificarPlazoCancelacion()
        {
            // RF 25: Verifica si estamos a más de 6 horas del inicio de la reserva
            DateTime momentoReserva = this.Fecha.Date + this.HoraInicio;
            return (momentoReserva - DateTime.Now).TotalHours >= 6;
        }

        public double CalcularReembolso()
        {
            if (VerificarPlazoCancelacion())
            {
                // Reembolso completo si está dentro del plazo (más de 6 horas)
                return CobroAsociado?.MontoFinal ?? 0;
            }
            // Penalización (ej: 50%) si cancela tarde (menos de 6 horas)
            return (CobroAsociado?.MontoFinal ?? 0) * 0.5;
        }

        public void ConfirmarReserva()
        {
            // RF 23: Podríamos agregar aquí la validación del cobro si es necesario
            if (this.IdCobro.HasValue) 
            {
                this.EstadoReserva = "Confirmada";
            }
        }
        
        // RF 16: Verificar la duración máxima permitida según el tipo de cancha
        public bool ValidarDuracionMaxima(string tipoDeCancha)
        {
             double horasSolicitadas = this.Duracion.TotalHours;

             return tipoDeCancha.ToLower() switch
             {
                 "fútbol 5" => horasSolicitadas <= 1.0,
                 "fútbol 7" => horasSolicitadas <= 1.5,
                 "fútbol 11" => horasSolicitadas <= 2.0,
                 _ => false // Si no reconoce el tipo, rechaza por seguridad
             };
        }
    }
}