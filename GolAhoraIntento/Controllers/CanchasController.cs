using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GolAhora.Reservas;
using GolAhora.Dtos;

namespace GolAhora.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // URL: api/canchas
    public class CanchasController : ControllerBase
    {
        private readonly GolContext _context;

        public CanchasController(GolContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerCanchas()
        {
            try
            {
                // Unimos Canchas con TipoCancha para llevarle la data al Front sin bucles JSON
                var listaCanchas = await (from c in _context.Canchas
                                          join t in _context.Set<TipoCancha>() on c.IdTipoCancha equals t.IdTipoCancha into tipoCanchaGroup
                                          from t in tipoCanchaGroup.DefaultIfEmpty()
                                          select new {
                                              c.IdCancha,
                                              c.IdTipoCancha,
                                              c.DiasHabiles,
                                              c.HoraInicio,
                                              c.HoraFin,
                                              c.DuracionMaxima,
                                              c.Disponible,
                                              tipoDeCancha = t != null ? new {
                                                  nombre = t.Nombre,
                                                  superficie = t.Superficie,
                                                  capacidad = t.Capacidad
                                              } : null
                                          }).ToListAsync();
                
                return Ok(listaCanchas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al listar canchas: {ex.Message}" });
            }
        }

        // 2. GET: api/canchas/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerCanchaPorId(int id)
        {
            // Le sacamos el .Include acá también para evitar el bucle infinito
            var cancha = await _context.Set<Cancha>()
                .FirstOrDefaultAsync(c => c.IdCancha == id);

            if (cancha == null) return NotFound(new { mensaje = "La cancha especificada no existe." });
            
            return Ok(cancha);
        }

        // 3. POST: api/canchas
        // Para que el Admin agregue una cancha nueva completando el formulario del Front
        [HttpPost]
        public async Task<IActionResult> CrearCancha([FromBody] CanchaDto dto)
        {
            var nuevaCancha = new Cancha 
            {
                IdTipoCancha = dto.IdTipoCancha,
                DiasHabiles = dto.DiasHabiles,
                HoraInicio = TimeSpan.Parse(dto.HoraInicio),
                HoraFin = TimeSpan.Parse(dto.HoraFin),
                DuracionMaxima = dto.DuracionMaxima,
                Disponible = dto.Disponible
            };

            _context.Canchas.Add(nuevaCancha);
            await _context.SaveChangesAsync();
            
            return Ok(new { mensaje = "Cancha creada con éxito" });
        }

        // 4. PUT: api/canchas/{id}
        // Modificación total adaptada a tus propiedades exactas
        [HttpPut("{id}")]

public async Task<IActionResult> ModificarCancha(int id, [FromBody] Cancha canchaModificada)
{
    // 1. Buscamos la cancha (sin incluir la relación)
    var canchaExiste = await _context.Set<Cancha>().FindAsync(id);
    
    if (canchaExiste == null) return NotFound(new { mensaje = "Cancha no encontrada." });

    // 2. IMPORTANTE: Desvinculamos la entidad del rastreador de EF 
    // Esto evita que EF intente validar cambios en la relación TipoDeCancha
    _context.Entry(canchaExiste).State = EntityState.Detached;

    // 3. Asignamos los nuevos valores al objeto que encontramos
    canchaModificada.IdCancha = id; // Aseguramos el ID correcto
    
    // 4. Le decimos a EF que este objeto está modificado
    _context.Entry(canchaModificada).State = EntityState.Modified;

    try
    {
        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Cancha modificada correctamente.", cancha = canchaModificada });
    }
    catch (Exception ex)
    {
        // Acá veremos el error real si esto vuelve a fallar
        var innerEx = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
        return StatusCode(500, new { mensaje = $"Error al actualizar: {innerEx}" });
    }
}

        // 5. DELETE: api/canchas/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarCancha(int id)
        {
            var cancha = await _context.Set<Cancha>().FindAsync(id);
            if (cancha == null) return NotFound(new { mensaje = "Cancha no encontrada." });

            try
            {
                _context.Set<Cancha>().Remove(cancha);
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Cancha eliminada del sistema correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al eliminar la cancha: {ex.Message}" });
            }
        }
    }
}