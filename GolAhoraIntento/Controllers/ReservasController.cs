using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using GolAhora.Usuarios; 
using GolAhora.Reservas;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace GolAhora.Controllers
{
    [ApiController]
    [Route("api/Reserva")]
    [Authorize]
    public class ReservaController : ControllerBase
    {
        private readonly GolContext _context;

        public ReservaController(GolContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CrearReserva([FromBody] NuevaReservaDto datosReserva)
        {
            try
            {
                await LimpiarReservasExpiradas();

                var dniClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(dniClaim)) return Unauthorized(new { mensaje = "Sesión inválida." });
                int dniCliente = int.Parse(dniClaim);

                DateTime fecha = DateTime.Parse(datosReserva.Fecha);
                TimeSpan horaInicio = TimeSpan.Parse(datosReserva.Hora);

                var cancha = await _context.Canchas.FindAsync(datosReserva.TipoCancha); 
                if (cancha == null) return NotFound(new { mensaje = "La cancha seleccionada no existe." });
                
                // 1. Buscamos el precio real en la tabla TipoCancha
                var tipoCancha = await _context.Set<TipoCancha>().FindAsync(cancha.IdTipoCancha);
                double precioCancha = tipoCancha != null ? tipoCancha.Precio : 0;

                double minutosTurno = cancha.DuracionMaxima < 10 ? cancha.DuracionMaxima * 60 : cancha.DuracionMaxima;
                TimeSpan horaFin = horaInicio.Add(TimeSpan.FromMinutes(minutosTurno));

                var nuevaReserva = new Reserva(fecha, horaInicio, horaFin, dniCliente, datosReserva.TipoCancha);

                if (!nuevaReserva.ValidarFechaReserva())
                    return BadRequest(new { mensaje = "La fecha excede los 30 días o es inválida." });

                var servicio = new ReservasService();
                var todasLasReservas = await _context.Reservas.ToListAsync();
                if (!servicio.ValidarDisponibilidad(nuevaReserva, todasLasReservas))
                    return BadRequest(new { mensaje = "¡Error: Ya existe una reserva en ese horario!" });

                // 2. CREAMOS EL COBRO MATEMÁTICO
                string concepto = $"Reserva {tipoCancha?.Nombre} - {fecha:dd/MM/yyyy} a las {horaInicio:hh\\:mm}hs";
                var nuevoCobro = new Cobro(precioCancha, concepto);
                
                _context.Set<Cobro>().Add(nuevoCobro);
                await _context.SaveChangesAsync(); // Guardamos para que MySQL le asigne el ID al cobro

                // 3. VINCULAMOS EL COBRO A LA RESERVA
                nuevaReserva.IdCobro = nuevoCobro.IdCobro;

                var usuarioActivo = await _context.Usuarios.FindAsync(dniCliente);
                if (usuarioActivo != null && usuarioActivo.GetType().Name.ToLower().Contains("admin"))
                {
                    nuevaReserva.EstadoReserva = "Confirmada";
                    nuevoCobro.Estado = "Pagado"; // El admin se auto-aprueba el cobro
                }

                _context.Reservas.Add(nuevaReserva);
                await _context.SaveChangesAsync();

                // 4. Mandamos el ID y el PRECIO EXACTO al Front-End
                return Ok(new { 
                    idReserva = nuevaReserva.IdReserva, 
                    precioTotal = precioCancha,
                    mensaje = "¡Reserva iniciada con éxito! Esperando pago." 
                });
            }
            catch (Exception ex)
            {
                string errorReal = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, new { mensaje = "Error en DB: " + errorReal });
            }
        }

        [HttpGet("MisReservas")]
        public async Task<IActionResult> ObtenerMisReservas()
        {
            try
            {
                await LimpiarReservasExpiradas();// limpiamos reservas de gente que no envió el comrpobante de pago
                var dniClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(dniClaim)) return Unauthorized(new { mensaje = "Sesión inválida." });

                int dniCliente = int.Parse(dniClaim);

                
                var misReservas = await (from r in _context.Reservas
                                         join c in _context.Canchas on r.IdCancha equals c.IdCancha
                                         join t in _context.Set<TipoCancha>() on c.IdTipoCancha equals t.IdTipoCancha 
                                         where r.DniCliente == dniCliente
                                         orderby r.Fecha
                                         select new {
                                             r.IdReserva,
                                             Fecha = r.Fecha.ToString("dd/MM/yyyy"),
                                             HoraInicio = r.HoraInicio.ToString(@"hh\:mm"), 
                                             Cancha = t.Nombre, 
                                             r.EstadoReserva,
                                             Precio = t.Precio,
                                             Cobro = r.IdCobro.HasValue ? "Pendiente de pago" : "Sin pagar"
                                         }).ToListAsync();

                return Ok(misReservas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al listar: " + ex.Message });
            }
        }

        [HttpGet("Todas")]
        public async Task<IActionResult> ObtenerTodasLasReservas()
        {
            try
            {
                await LimpiarReservasExpiradas();// limpiamos reservas de gente que no envió el comrpobante de pago
                var reservas = await (from r in _context.Reservas
                                      join c in _context.Canchas on r.IdCancha equals c.IdCancha
                                      join t in _context.Set<TipoCancha>() on c.IdTipoCancha equals t.IdTipoCancha
                                      join u in _context.Usuarios on r.DniCliente equals u.Dni
                                      orderby r.Fecha descending, r.HoraInicio
                                      select new {
                                          r.IdReserva,
                                          IdCancha = r.IdCancha,
                                          Fecha = r.Fecha.ToString("dd/MM/yyyy"),
                                          HoraInicio = r.HoraInicio.ToString(@"hh\:mm"), 
                                          HoraFin = r.HoraFin.ToString(@"hh\:mm"),
                                          Cancha = t.Nombre,
                                          Precio = t.Precio, 
                                          Cliente = u.Nombre + " " + u.Apellido,
                                          DniCliente = u.Dni,
                                          r.EstadoReserva,
                                          ComprobantePath = r.ComprobantePath 
                                      }).ToListAsync();

                return Ok(reservas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al listar reservas: " + ex.Message });
            }
        }

        [HttpGet("Comprobante/{nombreArchivo}")]
        [AllowAnonymous] 
        public IActionResult VerComprobante(string nombreArchivo)
        {
            var ruta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "comprobantes", nombreArchivo);
            if (!System.IO.File.Exists(ruta)) return NotFound("Comprobante no encontrado.");

            var mimeType = nombreArchivo.EndsWith(".pdf") ? "application/pdf" : "image/jpeg";
            return PhysicalFile(ruta, mimeType);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarReserva(int id)
        {
            try 
            {
                var reserva = await _context.Reservas.FindAsync(id);
                if (reserva == null) return NotFound(new { mensaje = "Reserva no encontrada." });
                
                _context.Reservas.Remove(reserva);
                await _context.SaveChangesAsync();
                
                return Ok(new { mensaje = "Reserva eliminada con éxito." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al eliminar: " + ex.Message });
            }
        }

        // --- MÉTODO DE CONFIRMACIÓN DE PAGO (ADMIN) ---
        [HttpPut("Confirmar/{id}")]
        public async Task<IActionResult> ConfirmarReserva(int id)
        {
            try
            {
                var reserva = await _context.Reservas.FindAsync(id);
                if (reserva == null) return NotFound(new { mensaje = "Reserva no encontrada." });

                reserva.EstadoReserva = "Confirmada";

                if (reserva.IdCobro.HasValue)
                {
                    var cobro = await _context.Set<Cobro>().FindAsync(reserva.IdCobro.Value);
                    if (cobro != null)
                    {
                        cobro.Estado = "Pagado";

                        // Creamos el Recibo  
                        var nuevoRecibo = new Recibo(cobro.MontoFinal);
                        _context.Set<Recibo>().Add(nuevoRecibo);
                        
                        // Guardamos para que MySQL nos devuelva el número de ID del recibo
                        await _context.SaveChangesAsync(); 

                        // Lo vinculamos al cobro
                        cobro.IdRecibo = nuevoRecibo.IdRecibo;
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "¡Pago registrado, recibo emitido y reserva confirmada con éxito!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al confirmar: " + ex.Message });
            }
        }

        // --- MÉTODO DE CANCELACIÓN CON REGLA DE NEGOCIO (CLIENTE) ---
        [HttpPut("Cancelar/{id}")]
        public async Task<IActionResult> CancelarReserva(int id)
        {
            try
            {
                var reserva = await _context.Reservas.FindAsync(id);
                if (reserva == null) return NotFound(new { mensaje = "Reserva no encontrada." });

                reserva.EstadoReserva = "Cancelada";

                // eliminamos el cobro pendiente
                if (reserva.IdCobro.HasValue)
                {
                    var cobro = await _context.Set<Cobro>().FindAsync(reserva.IdCobro.Value);
                    if (cobro != null && cobro.Estado != "Pagado") 
                    {
                        // Si no lo habían pagado, lo eliminamos físicamente
                        _context.Set<Cobro>().Remove(cobro);
                    }
                    // Desvinculamos el cobro de la reserva para evitar errores de MySQL
                    reserva.IdCobro = null; 
                }

                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Reserva cancelada y registros financieros limpiados." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al cancelar: " + ex.Message });
            }
        }

        [HttpPut("SubirComprobante/{id}")]
public async Task<IActionResult> SubirComprobante(int id, IFormFile archivo)
{
    try
    {
        await LimpiarReservasExpiradas(); // <--- PASAMOS LA ESCOBA

        if (archivo == null || archivo.Length == 0) 
            return BadRequest(new { mensaje = "No se ha seleccionado ningún archivo." });

        var reserva = await _context.Reservas.FindAsync(id);
        if (reserva == null) return NotFound(new { mensaje = "Reserva no encontrada." });

        if (reserva.EstadoReserva == "Cancelada") 
            return BadRequest(new { mensaje = "El tiempo de 10 minutos expiró y la reserva fue cancelada automáticamente." });

        // 1. Crear la carpeta si no existe (ej: wwwroot/comprobantes)
        string carpetaDestino = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "comprobantes");
        if (!Directory.Exists(carpetaDestino)) Directory.CreateDirectory(carpetaDestino);

        // 2. Armar un nombre único para el archivo para que no se superpongan
        string extension = Path.GetExtension(archivo.FileName);
        string nombreArchivo = $"comprobante_{id}{extension}";
        string rutaCompleta = Path.Combine(carpetaDestino, nombreArchivo);

        // 3. Guardar el archivo físico en el disco
        using (var stream = new FileStream(rutaCompleta, FileMode.Create))
        {
            await archivo.CopyToAsync(stream);
        }

        // 4. Actualizar la reserva en la Base de Datos
        reserva.ComprobantePath = nombreArchivo;
        reserva.EstadoReserva = "En Revisión"; // <--- Nuevo estado intermedio
        await _context.SaveChangesAsync();

        return Ok(new { mensaje = "Comprobante subido con éxito. Su reserva está siendo revisada." });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { mensaje = "Error al subir archivo: " + ex.Message });
    }
}

    private async Task LimpiarReservasExpiradas()
        {
            var limiteTiempo = DateTime.Now.AddMinutes(-10); 
            
            var reservasVencidas = await _context.Reservas
                .Where(r => r.EstadoReserva == "Pendiente" && r.FechaCreacion <= limiteTiempo)
                .ToListAsync();

            if (reservasVencidas.Any())
            {
                foreach (var r in reservasVencidas)
                {
                    r.EstadoReserva = "Cancelada";

                    if (r.IdCobro.HasValue)
                    {
                        var cobro = await _context.Set<Cobro>().FindAsync(r.IdCobro.Value);
                        if (cobro != null)
                        {
                            _context.Set<Cobro>().Remove(cobro);
                        }
                        r.IdCobro = null;
                    }
                }
                await _context.SaveChangesAsync();
            }
        }

    } // Fin del controlador

    // DTO de entrada
    public class NuevaReservaDto
    {
        public string Fecha { get; set; }
        public string Hora { get; set; }
        public int TipoCancha { get; set; }
    }

    
}

