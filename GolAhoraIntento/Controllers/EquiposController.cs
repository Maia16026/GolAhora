using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GolAhora.Actividades;
using Microsoft.AspNetCore.Authorization;

namespace GolAhora.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // URL: api/Equipos
    [Authorize(Roles = "Administrador")]
    public class EquiposController : ControllerBase
    {
        private readonly GolContext _context;

        public EquiposController(GolContext context)
        {
            _context = context;
        }

        // 1. GET: api/Equipos

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ObtenerEquipos()
        {
            try
            {
                var equipos = await _context.Equipos
                    .Include(e => e.Jugadores)
                        .ThenInclude(j => j.UsuarioAsociado) // Traemos la data del usuario real
                    .ToListAsync();
                return Ok(equipos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al obtener los equipos: {ex.Message}" });
            }
        }

        // 2. GET: api/Equipos/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> ObtenerEquipoPorId(int id)
        {
            try
            {
                var equipo = await _context.Equipos
                    .Include(e => e.Jugadores)
                        .ThenInclude(j => j.UsuarioAsociado) // Traemos la data del usuario real
                    .FirstOrDefaultAsync(e => e.IdEquipo == id);
                if (equipo == null) return NotFound(new { mensaje = "Equipo no encontrado." });
                return Ok(equipo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al obtener el equipo: {ex.Message}" });
            }
        }

        // 3. POST: api/Equipos (Crear equipo nuevo)
        [HttpPost]
        public async Task<IActionResult> CrearEquipo([FromBody] Equipo nuevoEquipo)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(nuevoEquipo.Nombre))
                {
                    return BadRequest(new { mensaje = "El nombre del equipo no puede estar vacío." });
                }

                _context.Equipos.Add(nuevoEquipo);
                await _context.SaveChangesAsync();

                // Devolvemos el equipo completo, incluyendo el IdEquipo autogenerado por MySQL
                return Ok(new { mensaje = "¡Equipo registrado con éxito!", equipo = nuevoEquipo });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al crear el equipo: {ex.Message}" });
            }
        }

        // PUT: api/Equipos/{id}
        [HttpPut("{id}")]

        public async Task<IActionResult> ModificarEquipo(int id, [FromBody] Equipo equipoActualizado)
        {
            var equipo = await _context.Equipos.FindAsync(id);
            if (equipo == null) return NotFound();
            equipo.Nombre = equipoActualizado.Nombre;
            await _context.SaveChangesAsync();
            return Ok(equipo);
        }

        // DELETE: api/Equipos/{id}
        [HttpDelete("{id}")]
     
        public async Task<IActionResult> EliminarEquipo(int id)
        {
        var equipo = await _context.Equipos.FindAsync(id);
        if (equipo == null) return NotFound();
        _context.Equipos.Remove(equipo);
        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Equipo eliminado" });
        }



        // GESTIÓN DE JUGADORES DEL EQUIPO

        public class AgregarJugadorDTO
        {
            public int Dni { get; set; }
            public string Nombre { get; set; } = string.Empty; 
        }

        [HttpPost("{idEquipo}/jugadores")]
      
        public async Task<IActionResult> AgregarJugador(int idEquipo, [FromBody] AgregarJugadorDTO dto)
        {
            var equipo = await _context.Equipos.Include(e => e.Jugadores).FirstOrDefaultAsync(e => e.IdEquipo == idEquipo);
            if (equipo == null) return NotFound(new { mensaje = "Equipo no encontrado." });

            if (equipo.Jugadores != null && equipo.Jugadores.Count >= 20)
                return BadRequest(new { mensaje = "El equipo alcanzó el límite máximo de jugadores (20)." });

            // Evitamos duplicados
            bool yaExiste = equipo.Jugadores.Any(j => j.DniUsuario == dto.Dni || j.DniInvitado == dto.Dni);
            if (yaExiste) return BadRequest(new { mensaje = "Este DNI ya está inscripto en este equipo." });

            var nuevoJugador = new Jugador { IdEquipo = idEquipo };

            // MAGIA: El Backend busca al usuario
            var usuarioDb = await _context.Usuarios.FindAsync(dto.Dni);

            if (usuarioDb != null)
            {
                nuevoJugador.DniUsuario = usuarioDb.Dni;
            }
            else
            {
                if (string.IsNullOrWhiteSpace(dto.Nombre)) 
                    return BadRequest(new { mensaje = "El DNI no está registrado en el sistema. Debes ingresar un Nombre para guardarlo como invitado." });
                    
                nuevoJugador.DniInvitado = dto.Dni;
                nuevoJugador.NombreInvitado = dto.Nombre;
            }

            try
            {
                _context.Set<Jugador>().Add(nuevoJugador);
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Jugador agregado al plantel con éxito." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al agregar jugador: {ex.Message}" });
            }
        }

        [HttpDelete("{idEquipo}/jugadores/{idJugador}")]
      
        public async Task<IActionResult> EliminarJugador(int idEquipo, int idJugador)
        {
            var jugador = await _context.Set<Jugador>().FirstOrDefaultAsync(j => j.IdJugador == idJugador && j.IdEquipo == idEquipo);
            if (jugador == null) return NotFound(new { mensaje = "El jugador no existe en este equipo." });

            try
            {
                _context.Set<Jugador>().Remove(jugador);
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Jugador desvinculado del equipo." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al quitar jugador." });
            }
        }
        
    }
}

