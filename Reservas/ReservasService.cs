using System;
using System.Collections.Generic;
using System.Linq;

namespace GolAhora.Reservas
{
    public class ReservasService
    {
        // RF 21: Evitar reservas superpuestas en la misma cancha y fecha
        public bool ValidarDisponibilidad(Reserva nuevaReserva, List<Reserva> reservasExistentes)
        {
            // Filtramos comparando misma cancha Y MISMA FECHA EXACTA
            var reservasCancha = reservasExistentes
                .Where(r => r.IdCancha == nuevaReserva.IdCancha 
                         && r.Fecha.Date == nuevaReserva.Fecha.Date // <--- ¡LA MAGIA FALTANTE!
                         && r.EstadoReserva != "Cancelada")
                .ToList();

            // Lógica de choque de horarios (ahora sí, solo del día seleccionado)
            bool hayChoque = reservasCancha.Any(reservaBd => 
                nuevaReserva.HoraInicio < reservaBd.HoraFin && 
                nuevaReserva.HoraFin > reservaBd.HoraInicio
            );

            // Si hay choque, retorna false (no disponible). Si está libre, retorna true.
            return !hayChoque;
        }
    }
}