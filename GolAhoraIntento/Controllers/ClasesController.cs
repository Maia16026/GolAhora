using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using GolAhora.Actividades;
using Microsoft.AspNetCore.Authorization;

namespace GolAhora.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // URL: api/clases
    [Authorize(Roles = "Administrador")]
    public class ClasesController : ControllerBase
    {
        private readonly GolContext _context;

        public ClasesController(GolContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ObtenerClases()
        {
            try
            {
                // Usamos .Select para traer solo los datos necesarios y evitar errores de mapeo DBNull
                var clases = await _context.Clases
                    .Include(c => c.ProfesorEncargado)
                    .Include(c => c.AlumnosInscriptos)
                    .Select(c => new
                    {
                        c.IdActividad,
                        c.NombreActividad,
                        c.CupoMaximo,
                        c.Dias,
                        c.Horario,
                        c.DniProfesor,
                        Profesor = c.ProfesorEncargado != null ? new { c.ProfesorEncargado.Dni, c.ProfesorEncargado.Nombre } : null,
                        AlumnosInscriptos = c.AlumnosInscriptos.Select(a => new { a.Dni, a.Nombre, a.Apellido }).ToList()
                    })
                    .ToListAsync();

                return Ok(clases);
            }
            catch (Exception ex)
            {
                Console.WriteLine("--- ERROR CAPTURADO EN OBTENER CLASES ---");
                Console.WriteLine(ex.ToString());
                return StatusCode(500, new { mensaje = "Error al obtener clases: " + ex.Message });
            }
        }

        [Authorize]
        [HttpPost("{idClase}/inscribir/{dniCliente}")]
        public async Task<IActionResult> InscribirAlumno(int idClase, int dniCliente)
        {
            // BLOQUE DE SEGURIDAD (PROTECCIÓN IDOR)
            // 1. Extraemos el DNI y el Rol del usuario desde las credenciales de su Token
            var dniTokenClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var rolTokenClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            
            if (string.IsNullOrEmpty(dniTokenClaim))
            {
                return Unauthorized(new { mensaje = "No se pudo identificar al usuario autenticado." });
            }

            int dniLogueado = int.Parse(dniTokenClaim);

            // 2. Si el que hace la petición NO es Administrador, 
            // obligatoriamente el DNI de su token debe coincidir con el dniCliente que mandó en la URL
            if (rolTokenClaim != "Administrador" && dniLogueado != dniCliente)
            {
            // 403 Forbid: El token es válido, pero el usuario no tiene permiso para alterar este recurso ajeno
            return Forbid(); 
            }
            var clase = await _context.Clases
                .Include(c => c.AlumnosInscriptos)
                .FirstOrDefaultAsync(c => c.IdActividad == idClase);

            var cliente = await _context.Clientes.FindAsync(dniCliente);

            if (clase == null || cliente == null)
                return NotFound(new { mensaje = "Clase o cliente no encontrados." });

            if (!clase.HayCupoDisponible())
                return Conflict(new { mensaje = "Lo sentimos, ya no quedan cupos para esta clase." });

            if (clase.AlumnosInscriptos.Any(a => a.Dni == dniCliente))
                return Conflict(new { mensaje = "El alumno ya está inscripto en esta clase." });

            clase.InscribirAlumno(cliente);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "¡Inscripción confirmada con éxito!" });
        }

        [HttpPost]
        public async Task<IActionResult> CrearClase([FromBody] Clase nuevaClase)
        {
            try
            {
                _context.ChangeTracker.Clear();

                var esProfesorValido = await _context.Profesores
                    .AsNoTracking()
                    .AnyAsync(p => p.Dni == nuevaClase.DniProfesor);

                if (!esProfesorValido)
                {
                    return BadRequest(new { mensaje = "El DNI no corresponde a un Profesor registrado." });
                }

                _context.Clases.Add(nuevaClase);
                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "¡Clase creada con éxito!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al guardar en BD: " + ex.Message });
            }
        }

        [HttpDelete("{idClase}/desinscribir/{dniCliente}")]
        public async Task<IActionResult> DesinscribirAlumno(int idClase, int dniCliente)
        {
            // BLOQUE DE SEGURIDAD (PROTECCIÓN IDOR)
            // 1. Extraemos el DNI y el Rol del usuario desde las credenciales de su Token
            var dniTokenClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var rolTokenClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            
            if (string.IsNullOrEmpty(dniTokenClaim))
            {
                return Unauthorized(new { mensaje = "No se pudo identificar al usuario autenticado." });
            }

            int dniLogueado = int.Parse(dniTokenClaim);

            // 2. Si el que hace la petición NO es Administrador, 
            // obligatoriamente el DNI de su token debe coincidir con el dniCliente que mandó en la URL
            if (rolTokenClaim != "Administrador" && dniLogueado != dniCliente)
            {
            // 403 Forbid: El token es válido, pero el usuario no tiene permiso para alterar este recurso ajeno
            return Forbid(); 
            }
            try
            {
                var clase = await _context.Clases
                    .Include(c => c.AlumnosInscriptos)
                    .FirstOrDefaultAsync(c => c.IdActividad == idClase);

                var cliente = await _context.Clientes.FindAsync(dniCliente);

                if (clase == null || cliente == null)
                    return NotFound(new { mensaje = "Clase o cliente no encontrados." });

                clase.AlumnosInscriptos.Remove(cliente);
                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Alumno removido de la clase con éxito." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarClase(int id)
        {
            try
            {
                var clase = await _context.Clases.FindAsync(id);
                if (clase == null) return NotFound(new { mensaje = "La clase no existe." });

                _context.Clases.Remove(clase);
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Clase eliminada correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al eliminar: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditarClase(int id, [FromBody] Clase claseEditada)
        {
            try
            {
                var claseExistente = await _context.Clases.FindAsync(id);
                if (claseExistente == null) return NotFound(new { mensaje = "La clase no existe." });

                claseExistente.NombreActividad = claseEditada.NombreActividad;
                claseExistente.DniProfesor = claseEditada.DniProfesor;
                claseExistente.CupoMaximo = claseEditada.CupoMaximo;
                claseExistente.Dias = claseEditada.Dias;
                claseExistente.Horario = claseEditada.Horario;

                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "¡Clase actualizada correctamente!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al editar: {ex.Message}" });
            }
        }
    }
}