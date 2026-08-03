using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GolAhora.Actividades;
using GolAhora.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace GolAhora.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // URL: api/torneos
    [Authorize(Roles = "Administrador")]
    public class TorneosController : ControllerBase
    {
        private readonly GolContext _context;

        public TorneosController(GolContext context)
        {
            _context = context;
        }

        // 1. GET: api/torneos
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ObtenerTorneos()
        {
            try
            {
                var torneos = await _context.Torneos
                    .Include(t => t.Equipos) // Nombre corregido
                    .ToListAsync();
                
                return Ok(torneos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al obtener torneos: {ex.Message}" });
            }
        }

        // 2. POST: api/torneos
        [HttpPost]
        public async Task<IActionResult> CrearTorneo([FromBody] Torneo nuevoTorneo)
        {
            try
            {
                _context.Torneos.Add(nuevoTorneo);
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "¡Torneo creado con éxito!", torneo = nuevoTorneo });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al crear el torneo: {ex.Message}" });
            }
        }

        // 3. POST: api/torneos/{idTorneo}/inscribir/{idEquipo}
        [HttpPost("{idTorneo}/inscribir/{idEquipo}")]
        public async Task<IActionResult> InscribirEquipo(int idTorneo, int idEquipo)
        {
            try
            {
                var torneo = await _context.Torneos
                    .Include(t => t.Equipos) // Nombre corregido
                    .FirstOrDefaultAsync(t => t.IdActividad == idTorneo); // Usa la PK de Actividad

                var equipo = await _context.Equipos.FindAsync(idEquipo);

                if (torneo == null || equipo == null)
                {
                    return NotFound(new { mensaje = "No se encontró el torneo o el equipo especificado." });
                }

                if (torneo.Equipos.Any(e => e.IdEquipo == idEquipo)) // Nombre corregido
                {
                    return Conflict(new { mensaje = "El equipo ya se encuentra inscripto en este torneo." });
                }

                torneo.Equipos.Add(equipo); // Nombre corregido
                await _context.SaveChangesAsync();

                return Ok(new { mensaje = $"El equipo {equipo.Nombre} fue inscripto correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error en la inscripción: {ex.Message}" });
            }
        }

        // 4. POST: api/torneos/{idTorneo}/generar-fixture
        [HttpPost("{idTorneo}/generar-fixture")]
        public async Task<IActionResult> GenerarFixture(int idTorneo)
        {
            var torneo = await _context.Torneos
                .Include(t => t.Equipos) // Nombre corregido
                .Include(t => t.Llaves)
                .FirstOrDefaultAsync(t => t.IdActividad == idTorneo);

            if (torneo == null) return NotFound("Torneo no encontrado.");

            torneo.GenerarLlaves();
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Fixture generado con éxito." });
        }

        // 5. DELETE: api/torneos/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarTorneo(int id)
        {
            var torneo = await _context.Torneos
                .Include(t => t.ReglamentoCompeticion)
                .Include(t => t.Llaves)
                .FirstOrDefaultAsync(t => t.IdActividad == id);

            if (torneo == null) return NotFound(new { mensaje = "Torneo no encontrado." });

            // Borramos en cascada (Torneos tiene "Llaves" en vez de "Fechas")
            if (torneo.Llaves.Any())
            {
                _context.RemoveRange(torneo.Llaves);
            }
            if (torneo.ReglamentoCompeticion != null)
            {
                _context.Remove(torneo.ReglamentoCompeticion);
            }

            _context.Torneos.Remove(torneo);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Torneo eliminado correctamente." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ModificarTorneo(int id, [FromBody] EditarCompeticionDto dto)
        {
            var torneo = await _context.Torneos.Include(t => t.Equipos).FirstOrDefaultAsync(t => t.IdActividad == id);
            
            if (torneo == null) return NotFound(new { mensaje = "Torneo no encontrado." });

            if (dto.CupoMaximo < torneo.Equipos.Count)
            {
                return BadRequest(new { mensaje = $"No podés reducir el cupo a {dto.CupoMaximo}. Ya hay {torneo.Equipos.Count} equipos inscriptos." });
            }

            if (!new[] { 4, 8, 16, 32, 64, 128 }.Contains(dto.CupoMaximo))
            {
                return BadRequest(new { mensaje = "El cupo de un torneo debe ser 4, 8, 16, 32, 64 o 128." });
            }

            torneo.NombreActividad = dto.NombreActividad;
            torneo.CupoMaximo = dto.CupoMaximo;
            
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "¡Torneo actualizado con éxito!" });
        }
        [HttpPost("{idTorneo}/avanzar-ronda")]
        public async Task<IActionResult> AvanzarRonda(int idTorneo)
        {
            var torneo = await _context.Torneos
        .Include(t => t.Llaves)
        .FirstOrDefaultAsync(t => t.IdActividad == idTorneo);

        torneo.AvanzarRonda();
        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Ronda avanzada con éxito." });
        }
    }
}