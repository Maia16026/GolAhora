using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GolAhora.Reservas;
using GolAhora.Usuarios;
using GolAhora.Actividades;
using Microsoft.AspNetCore.Authorization;

namespace GolAhora.Controllers // ¡Cambiamos el namespace para que coincida con la carpeta!
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles="Administrador")]
    public class PagosController : ControllerBase
    {
        private readonly GolContext _context;

        public PagosController(GolContext context)
        {
            _context = context;
        }

        #region MODELOS DTO
        public class CobroCanchaDTO
        {
            public int IdReserva { get; set; }
            public double MontoBase { get; set; }
            public double MontoFinal { get; set; }
        }

        public class CobroCompeticionDTO
        {
            public int IdEquipo { get; set; }
            public int IdCompeticion { get; set; }
            public double MontoBase { get; set; }
            public double MontoFinal { get; set; }
        }

        public class CobroAdicionalDTO
        {
            public int IdUsuario { get; set; }
            public string NombreServicio { get; set; } = string.Empty;
            public double MontoBase { get; set; }
            public double MontoFinal { get; set; }
        }

        public class ModificarCobroDTO
        {
            public string NuevoConcepto { get; set; } = string.Empty;
            public string NuevoEstado { get; set; } = string.Empty;
        }
        #endregion

        #region RFS

        [HttpGet("Todos")]
        public async Task<IActionResult> ObtenerTodosLosCobros()
        {
            try
            {
                var cobros = await _context.Set<Cobro>()
                    // Si tenés configurados los Includes, descomentalos:
                    // .Include(c => c.DescuentoAplicado)
                    // .Include(c => c.ReciboEmitido)
                    .OrderByDescending(c => c.Fecha)
                    .Select(c => new {
                        c.IdCobro,
                        Fecha = c.Fecha.ToString("yyyy-MM-dd HH:mm:ss"), // Formato exacto para JS
                        c.Concepto,
                        c.MontoBase,
                        c.MontoFinal,
                        c.Estado,
                        TieneRecibo = c.IdRecibo != null
                    })
                    .ToListAsync();

                return Ok(cobros);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al obtener finanzas: " + ex.Message });
            }
        }

        // rf 55 - Registrar los cobros correspondientes al alquier de canchas
        [HttpPost("cobro-cancha")]
        public async Task<IActionResult> RegistrarCobroAlquiler([FromBody] CobroCanchaDTO dto)
        {
            var reserva = await _context.Set<Reserva>().FindAsync(dto.IdReserva);
            if (reserva == null) return NotFound("La reserva de cancha especificada no existe.");

            var nuevoCobro = new Cobro
            {
                Fecha = DateTime.Now,
                MontoBase = dto.MontoBase,
                MontoFinal = dto.MontoFinal,
                Concepto = $"Alquiler de Cancha - Reserva #{dto.IdReserva}",
                Estado = "Aprobado"
            };

            try
            {
                // 1. Guardamos el cobro en la base de datos
                await _context.Set<Cobro>().AddAsync(nuevoCobro);
                await _context.SaveChangesAsync();

                // 2. ¡LA MAGIA DE LA INTEGRACIÓN! 
                // Le avisamos a tu reserva cuál es su cobro y disparamos tu método
                reserva.IdCobro = nuevoCobro.IdCobro;
                reserva.ConfirmarReserva(); 
                
                // 3. Guardamos la reserva actualizada
                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Cobro registrado y Reserva confirmada con éxito.", idCobro = nuevoCobro.IdCobro });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al registrar el cobro: {ex.Message}");
            }
        }

        //rf 56 - registrar los cobros correspondientes a inscripciones a ligas
        [HttpPost("cobro-liga")]
        public async Task<IActionResult> RegistrarCobroLiga([FromBody] CobroCompeticionDTO dto)
        {
            var liga = await _context.Set<Liga>().FindAsync(dto.IdCompeticion);
            if (liga == null) return NotFound("La liga especificada no existe.");

            var equipo = await _context.Set<Equipo>().FindAsync(dto.IdEquipo);
            if (equipo == null) return NotFound("El equipo especificado no existe.");

            var nuevoCobroLiga = new Cobro
            {
                Fecha = DateTime.Now,
                MontoBase = dto.MontoBase,
                MontoFinal = dto.MontoFinal,
                Concepto = $"Inscripción de Equipo #{dto.IdEquipo} a Liga {dto.IdCompeticion}",
                Estado = "Aprobado"
            };

            try
            {
                await _context.Set<Cobro>().AddAsync(nuevoCobroLiga);
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Cobro de inscripción a liga registrado con éxito.", idCobro = nuevoCobroLiga.IdCobro });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al registrar cobro de liga: {ex.Message}");
            }
        }

        //rf 57 - registrar los cobros correspondientes a torneos
        [HttpPost("cobro-torneo")]
        public async Task<IActionResult> RegistrarCobroTorneo([FromBody] CobroCompeticionDTO dto)
        {
            var torneo = await _context.Set<Torneo>().FindAsync(dto.IdCompeticion);
            if (torneo == null) return NotFound("El torneo especificado no existe.");

            var equipo = await _context.Set<Equipo>().FindAsync(dto.IdEquipo);
            if (equipo == null) return NotFound("El equipo especificado no existe.");

            var nuevoCobroTorneo = new Cobro
            {
                Fecha = DateTime.Now,
                MontoBase = dto.MontoBase,
                MontoFinal = dto.MontoFinal,
                Concepto = $"Inscripción de Equipo #{dto.IdEquipo} a Torneo #{dto.IdCompeticion}",
                Estado = "Aprobado"
            };

            try
            {
                await _context.Set<Cobro>().AddAsync(nuevoCobroTorneo);
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Cobro de inscripción a torneo registrado con éxito.", idCobro = nuevoCobroTorneo.IdCobro });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al registrar cobro de torneo: {ex.Message}");
            }
        }

        // rf 58 - registrar los cobros correspondiente a otros servicios adicionales
        [HttpPost("cobro-servicio-adicional")]
        public async Task<IActionResult> RegistrarCobroServicioAdicional([FromBody] CobroAdicionalDTO dto)
        {
            var usuario = await _context.Set<Usuario>().FindAsync(dto.IdUsuario);
            if (usuario == null) return NotFound("El usuario especificado no existe.");

            var nuevoCobroServicio = new Cobro
            {
                Fecha = DateTime.Now,
                MontoBase = dto.MontoBase,
                MontoFinal = dto.MontoFinal,
                Concepto = $"Servicio Adicional: {dto.NombreServicio} - Usuario #{dto.IdUsuario}",
                Estado = "Aprobado"
            };

            try
            {
                await _context.Set<Cobro>().AddAsync(nuevoCobroServicio);
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Cobro de servicio adicional registrado.", idCobro = nuevoCobroServicio.IdCobro });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al registrar servicio adicional: {ex.Message}");
            }
        }

        //rf 59 - el sistema debe permitir consultar los detalles de los cobros registrados
        [HttpGet("{id}")]
        public async Task<IActionResult> ConsultarCobro(int id)
        {
            var cobro = await _context.Set<Cobro>()
                .Include(c => c.DescuentoAplicado)
                .Include(c => c.ReciboEmitido)
                .FirstOrDefaultAsync(c => c.IdCobro == id);

            if (cobro == null) return NotFound($"No se encontró ningún cobro con el ID {id}.");

            return Ok(cobro);
        }

        // rf 60 - el sistema debe permitir modificar los detalles de los cobros registrados
        [HttpPut("{id}")]
        public async Task<IActionResult> ModificarCobro(int id, [FromBody] ModificarCobroDTO dto)
        {
            var cobro = await _context.Set<Cobro>().FindAsync(id);
            if (cobro == null) return NotFound("Cobro no encontrado.");

            cobro.Concepto = dto.NuevoConcepto;
            cobro.Estado = dto.NuevoEstado;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Cobro modificado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al modificar cobro: {ex.Message}");
            }
        }

        // rf 61 - el sistema debe permitir eliminar los detalles de los cobros registrados (baja logica)
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarCobro(int id)
        {
            var cobro = await _context.Set<Cobro>().FindAsync(id);
            if (cobro == null) return NotFound("Cobro no encontrado.");

            cobro.AnularCobro();

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Cobro anulado (eliminado lógicamente) con éxito." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al anular el cobro: {ex.Message}");
            }
        }

        // rf 62 - el sistema debe permitir imprimir los detalles de los cobros registrados
        [HttpGet("{id}/imprimir")]
        public async Task<IActionResult> ImprimirCobro(int id)
        {
            var cobro = await _context.Set<Cobro>()
                .Include(c => c.DescuentoAplicado)
                .FirstOrDefaultAsync(c => c.IdCobro == id);

            if (cobro == null) return NotFound("Cobro no encontrado para impresión.");

            string ticket = $"==================================\n" +
                            $"           GOL AHORA              \n" +
                            $"       TICKET DE COBRO            \n" +
                            $"==================================\n" +
                            $"ID Cobro: {cobro.IdCobro}\n" +
                            $"Fecha: {cobro.Fecha:dd/MM/yyyy HH:mm}\n" +
                            $"Concepto: {cobro.Concepto}\n" +
                            $"Estado: {cobro.Estado}\n" +
                            $"----------------------------------\n" +
                            $"Monto Base: ${cobro.MontoBase}\n";

            if (cobro.DescuentoAplicado != null)
            {
                ticket += $"Descuento Aplicado ({cobro.IdDescuento}): -${cobro.DescuentoAplicado.Valor}\n";
            }

            ticket += $"----------------------------------\n" +
                      $"MONTO FINAL: ${cobro.MontoFinal}\n" +
                      $"==================================\n";

            return Content(ticket, "text/plain");
        }
        #endregion

        #region MODELOS DTO PARA RECIBOS
        public class RegistrarReciboDTO
        {
            public int IdCobro { get; set; }
            public double Monto { get; set; }
        }

        public class ModificarReciboDTO
        {
            public double NuevoMonto { get; set; }
        }
        #endregion

        #region RF - RECIBOS
        //rf 63 - el sistema debe permitir registrar los recibos de pago
        [HttpPost("recibos")]
        public async Task<IActionResult> RegistrarRecibo([FromBody] RegistrarReciboDTO dto)
        {
            var cobro = await _context.Set<Cobro>().FindAsync(dto.IdCobro);
            if (cobro == null) return NotFound("El cobro especificado no existe.");

            var nuevoRecibo = new Recibo(dto.Monto);

            try
            {
                await _context.Set<Recibo>().AddAsync(nuevoRecibo);
                await _context.SaveChangesAsync();
                
                cobro.IdRecibo = nuevoRecibo.IdRecibo;
                cobro.ReciboEmitido = nuevoRecibo;
                cobro.Estado = "Pagado";

                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Recibo registrado y vinculado al cobro con éxito.", idRecibo = nuevoRecibo.IdRecibo });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al registrar el recibo: {ex.Message}");
            }
        }

        // rf 64 - el sistema debe permitir consultar los recibos de pago
        [HttpGet("recibos/{id}")]
        public async Task<IActionResult> ConsultarRecibo(int id)
        {
            var recibo = await _context.Set<Recibo>().FindAsync(id);
            if (recibo == null) return NotFound($"No se encontró el recibo con ID {id}.");

            return Ok(recibo);
        }

        // rf 65 - el sisterma debe permitir modificar los recibos de pago
        [HttpPut("recibos/{id}")]
        public async Task<IActionResult> ModificarRecibo(int id, [FromBody] ModificarReciboDTO dto)
        {
            var recibo = await _context.Set<Recibo>().FindAsync(id);
            if (recibo == null) return NotFound("Recibo no encontrado.");

            recibo.Monto = dto.NuevoMonto;
            recibo.Fecha = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Recibo modificado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al modificar recibo: {ex.Message}");
            }
        }

        // rf 66 - el sistema debe permitir eliminar los recivos de pago
        [HttpDelete("recibos/{id}")]
        public async Task<IActionResult> EliminarRecibo(int id)
        {
            var recibo = await _context.Set<Recibo>().FindAsync(id);
            if (recibo == null) return NotFound("Recibo no encontrado.");

            try
            {
                _context.Set<Recibo>().Remove(recibo);
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Recibo eliminado correctamente de la base de datos." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar recibo: {ex.Message}");
            }
        }

        // rf 67 - el sistema debe permitir imprimir los recibos de pago
        [HttpGet("recibos/{id}/imprimir")]
        public async Task<IActionResult> ImprimirRecibo(int id)
        {
            var recibo = await _context.Set<Recibo>().FindAsync(id);
            if (recibo == null) return NotFound("Recibo no encontrado.");

            string resumenInyeccion = recibo.ObtenerResumen();

            string ticketRecibo = $"==================================\n" +
                                  $"           GOL AHORA              \n" +
                                  $"       RECIBO DE PAGO OFICIAL     \n" +
                                  $"==================================\n" +
                                  $"{resumenInyeccion}\n" +
                                  $"----------------------------------\n" +
                                  $"Gracias por elegir El Buen Deporte\n" +
                                  $"==================================\n";

            return Content(ticketRecibo, "text/plain");
        }
        #endregion

        #region MODELOS DTO PARA REEMBOLSOS Y DESCUENTOS
        public class ReembolsoDTO
        {
            public int IdCobro { get; set; }
            public bool EsTotal { get; set; }
            public double MontoParcial { get; set; }
            public int HorasAntelacion { get; set; }
        }

        public class AplicarDescuentoDTO
        {
            public int IdCobro { get; set; }
            public int IdDescuento { get; set; }
        }
        #endregion

        #region RF - REEMBOLSOS Y DESCUENTOS
        // rf 68 - registrar los reembolsos totale so parciales por cancelaciones realizadas dentro del plazo permitido
        [HttpPost("reembolsos")]
        public async Task<IActionResult> ProcesarReembolso([FromBody] ReembolsoDTO dto)
        {
            var cobro = await _context.Set<Cobro>().FindAsync(dto.IdCobro);
            if (cobro == null) return NotFound("El cobro asociado no existe.");

            const int plazoMinimoHoras = 6;
            if (dto.HorasAntelacion < plazoMinimoHoras)
            {
                return BadRequest($"Cancelación fuera de término. Se realizó con {dto.HorasAntelacion}hs de antelación y el mínimo permitido es de {plazoMinimoHoras}hs. Se aplica penalización.");
            }

            try
            {
                if (dto.EsTotal)
                {
                    cobro.Estado = "Reembolsado Total";
                    cobro.MontoFinal = 0; 
                }
                else
                {
                    cobro.Estado = "Reembolsado Parcial";
                    cobro.MontoFinal = cobro.MontoBase - dto.MontoParcial;
                }

                await _context.SaveChangesAsync();
                return Ok(new { mensaje = $"Reembolso procesado con éxito como: {cobro.Estado}." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al procesar el reembolso: {ex.Message}");
            }
        }

        //rf 69 - aplicar descuentos segun criterios definidos por el club
        [HttpPost("aplicar-descuento")]
        public async Task<IActionResult> AplicarDescuento([FromBody] AplicarDescuentoDTO dto)
        {
            var cobro = await _context.Set<Cobro>().FindAsync(dto.IdCobro);
            if (cobro == null) return NotFound("El cobro especificado no existe.");

            var descuento = await _context.Set<Descuento>().FindAsync(dto.IdDescuento);
            if (descuento == null) return NotFound("El tipo de descuento seleccionado no existe.");

            try
            {
                cobro.IdDescuento = descuento.IdDescuento;
                cobro.DescuentoAplicado = descuento;

                cobro.CalcularTotal();

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    mensaje = "Descuento aplicado correctamente.",
                    montoBase = cobro.MontoBase,
                    montoFinal = cobro.MontoFinal
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al aplicar el descuento: {ex.Message}");
            }
        }
        #endregion
    }
}
