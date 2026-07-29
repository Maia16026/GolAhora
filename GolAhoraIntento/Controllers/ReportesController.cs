using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using GolAhora.Reservas;

namespace GolAhora.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // URL: api/reportes
    public class ReportesController : ControllerBase
    {
        private readonly GolContext _context;

        public ReportesController(GolContext context)
        {
            _context = context;
        }

        // 1. GET: api/reportes/ingresos
        // Mapea al método "Generar reporte de ingresos" de Administrador
        [HttpGet("ingresos")]
        public async Task<IActionResult> ObtenerReporteIngresos([FromQuery] DateTime? fechaInicio, [FromQuery] DateTime? fechaFin)
        {
            try
            {
                var inicio = fechaInicio ?? DateTime.Now.AddDays(-30);
                var fin = fechaFin ?? DateTime.Now;

                // Buscamos todos los cobros efectivos en ese rango de fechas
                var cobros = await _context.Set<Cobro>()
                    .Where(c => c.Fecha >= inicio && c.Fecha <= fin && (c.Estado == "Aprobado" || c.Estado == "Pagado"))
                    .ToListAsync();

                var totalRecaudado = cobros.Sum(c => c.MontoFinal);
                var cantidadTransacciones = cobros.Count;

                return Ok(new
                {
                    reporte = "Reporte de Ingresos Generales",
                    periodo = $"{inicio:dd/MM/yyyy} hasta {fin:dd/MM/yyyy}",
                    totalRecaudado = totalRecaudado,
                    totalVentas = cantidadTransacciones,
                    detalle = cobros.Select(c => new { c.IdCobro, c.Fecha, c.Concepto, c.MontoFinal })
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al generar reporte de ingresos: {ex.Message}" });
            }
        }

        // 2. GET: api/reportes/canchas
        // Mapea al método "Generar reporte" dentro de Canchas (Estadísticas de uso)
        [HttpGet("canchas")]
        public async Task<IActionResult> ObtenerReporteCanchas()
        {
            try
            {
                // Traemos las reservas confirmadas para cruzarlas
                var reservas = await _context.Reservas
                    .Where(r => r.EstadoReserva == "Confirmada")
                    .ToListAsync();

                var canchas = await _context.Set<Cancha>().Include(c => c.TipoDeCancha).ToListAsync();

                // Agrupamos las reservas por IdCancha usando LINQ en memoria
                var estadisticas = canchas.Select(c => new
                {
                    idCancha = c.IdCancha,
                    nombre = $"Cancha #{c.IdCancha} ({c.TipoDeCancha?.Nombre ?? "Sin Tipo"})",
                    totalReservas = reservas.Count(r => r.IdCancha == c.IdCancha),
                    horasAlquiladas = reservas.Where(r => r.IdCancha == c.IdCancha).Sum(r => r.Duracion.TotalHours)
                })
                .OrderByDescending(e => e.totalReservas) // La más alquilada primero
                .ToList();

                return Ok(new
                {
                    reporte = "Estadísticas de Ocupación de Canchas",
                    fechaGeneracion = DateTime.Now.ToString("dd/MM/yyyy HH:mm"),
                    ranking = estadisticas
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al generar reporte de canchas: {ex.Message}" });
            }
        }

        // 3. GET: api/reportes/reservas
        // Mapea al método "Generar reporte" dentro de Reserva (Estado de la agenda)
        [HttpGet("reservas")]
        public async Task<IActionResult> ObtenerReporteReservas()
        {
            try
            {
                var todasLasReservas = await _context.Reservas.ToListAsync();

                var total = todasLasReservas.Count;
                var confirmadas = todasLasReservas.Count(r => r.EstadoReserva == "Confirmada");
                var pendientes = todasLasReservas.Count(r => r.EstadoReserva == "Pendiente");
                var anuladas = todasLasReservas.Count(r => r.EstadoReserva == "Anulado" || r.EstadoReserva == "Cancelada");

                return Ok(new
                {
                    reporte = "Métricas Globales de Reservas",
                    totalReservasRegistradas = total,
                    estados = new
                    {
                        confirmadas = confirmadas,
                        pendientes = pendientes,
                        anuladas = anuladas
                    },
                    efectividadCancelacion = total > 0 ? (double)anuladas / total * 100 : 0
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al generar reporte de reservas: {ex.Message}" });
            }
        }
    }
}