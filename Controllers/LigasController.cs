using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using GolAhora.Actividades;
using GolAhora.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace GolAhora.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // URL: api/ligas
    [Authorize(Roles = "Administrador")]
    public class LigasController : ControllerBase
    {
        private readonly GolContext _context;

        public LigasController(GolContext context)
        {
            _context = context;
        }

        // 1. GET: api/ligas
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ObtenerLigas()
        {
            try
            {
                var ligas = await _context.Ligas
                    .Include(l => l.Equipos)
                    .Include(l => l.Fechas) 
                    .ToListAsync();
                return Ok(ligas);
            }
            catch (Exception ex) { return StatusCode(500, new { mensaje = ex.Message }); }
        }

        // 2. POST: api/ligas
        [HttpPost]
        public async Task<IActionResult> CrearLiga([FromBody] Liga nuevaLiga)
        {
            try
            {
                _context.Ligas.Add(nuevaLiga);
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "¡Liga creada con éxito!", liga = nuevaLiga });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al crear la liga: {ex.Message}" });
            }
        }

        // 3. POST: api/ligas/{idLiga}/inscribir/{idEquipo}
        [HttpPost("{idLiga}/inscribir/{idEquipo}")]
        public async Task<IActionResult> InscribirEquipo(int idLiga, int idEquipo)
        {
            try
            {
                var liga = await _context.Ligas
                    .Include(l => l.Equipos) 
                    .FirstOrDefaultAsync(l => l.IdActividad == idLiga);

                var equipo = await _context.Equipos.FindAsync(idEquipo);

                if (liga == null || equipo == null)
                {
                    return NotFound(new { mensaje = "No se encontró la liga o el equipo especificado." });
                }

                if (liga.Equipos.Any(e => e.IdEquipo == idEquipo)) 
                {
                    return Conflict(new { mensaje = "El equipo ya se encuentra inscripto en esta liga." });
                }

                liga.Equipos.Add(equipo); 
                await _context.SaveChangesAsync();

                return Ok(new { mensaje = $"El equipo {equipo.Nombre} fue inscripto correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error en la inscripción: {ex.Message}" });
            }
        }

        // 4. POST: api/ligas/{idLiga}/iniciar
        [HttpPost("{idLiga}/iniciar")]
        public async Task<IActionResult> IniciarLiga(int idLiga)
        {
            var liga = await _context.Ligas
                .Include(l => l.Equipos) 
                .Include(l => l.Posiciones)
                .Include(l => l.Fechas)            
                    .ThenInclude(f => f.Partidos)  
                .FirstOrDefaultAsync(l => l.IdActividad == idLiga);

            if (liga == null) return NotFound("Liga no encontrada.");

            // Limpiamos fixtures viejos si existían
            if (liga.Fechas.Any())
            {
                _context.RemoveRange(liga.Fechas.SelectMany(f => f.Partidos)); 
                _context.RemoveRange(liga.Fechas); 
            }
            if (liga.Posiciones.Any())
            {
                _context.RemoveRange(liga.Posiciones); 
            }

            liga.GenerarFixture();
            liga.InicializarTabla();
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Fixture y tabla de posiciones inicializados." });
        }

        // 5. GET: api/ligas/{idLiga}/tabla
        [HttpGet("{idLiga}/tabla")]
        [AllowAnonymous]
        public async Task<IActionResult> ObtenerTablaPosiciones(int idLiga)
        {
            var liga = await _context.Ligas
                .Include(l => l.Posiciones)
                    .ThenInclude(p => p.EquipoAsociado)
                .FirstOrDefaultAsync(l => l.IdActividad == idLiga);

            if (liga == null) return NotFound("Liga no encontrada.");

            liga.OrdenarTabla();

            return Ok(liga.Posiciones);
        }

        // 6. GET: api/ligas/{idLiga}/fixture
        [HttpGet("{idLiga}/fixture")]
        [AllowAnonymous]
        public async Task<IActionResult> ObtenerFixture(int idLiga)
        {
            var liga = await _context.Ligas
                .Include(l => l.Fechas)
                    .ThenInclude(f => f.Partidos)
                        .ThenInclude(p => p.Local)
                .Include(l => l.Fechas)
                    .ThenInclude(f => f.Partidos)
                        .ThenInclude(p => p.Visitante)
                .FirstOrDefaultAsync(l => l.IdActividad == idLiga);

            if (liga == null) return NotFound("Liga no encontrada.");

            var fechasOrdenadas = liga.Fechas.OrderBy(f => f.NumeroFecha).ToList();

            return Ok(fechasOrdenadas);
        }

        // 7. DELETE: api/ligas/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarLiga(int id)
        {
            var liga = await _context.Ligas
                .Include(l => l.ReglamentoCompeticion)
                .Include(l => l.Fechas).ThenInclude(f => f.Partidos)
                .Include(l => l.Posiciones)
                .FirstOrDefaultAsync(l => l.IdActividad == id);

            if (liga == null) return NotFound(new { mensaje = "Liga no encontrada." });

            if (liga.Fechas.Any())
            {
                _context.RemoveRange(liga.Fechas.SelectMany(f => f.Partidos));
                _context.RemoveRange(liga.Fechas);
            }
            if (liga.Posiciones.Any())
            {
                _context.RemoveRange(liga.Posiciones);
            }
            if (liga.ReglamentoCompeticion != null)
            {
                _context.Remove(liga.ReglamentoCompeticion);
            }

            _context.Ligas.Remove(liga);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Liga eliminada correctamente." });
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> ModificarLiga(int id, [FromBody] EditarCompeticionDto dto)
        {
            var liga = await _context.Ligas.Include(l => l.Equipos).FirstOrDefaultAsync(l => l.IdActividad == id);
            
            if (liga == null) return NotFound(new { mensaje = "Liga no encontrada." });

            if (dto.CupoMaximo < liga.Equipos.Count)
            {
                return BadRequest(new { mensaje = $"No podés reducir el cupo a {dto.CupoMaximo}. Ya hay {liga.Equipos.Count} equipos inscriptos." });
            }

            liga.NombreActividad = dto.NombreActividad;
            liga.CupoMaximo = dto.CupoMaximo;
           
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "¡Liga actualizada con éxito!" });
        }


        public class ResultadoDto {
            public int GolesLocal { get; set; }
            public int GolesVisitante { get; set; }
        }

        [HttpPut("{idLiga}/partidos/{idPartido}/resultado")]
        public async Task<IActionResult> CargarResultadoPartido(int idLiga, int idPartido, [FromBody] ResultadoDto resultado)
        {
            var liga = await _context.Ligas
                .Include(l => l.ReglamentoCompeticion)
                .Include(l => l.Posiciones)
                .Include(l => l.Fechas).ThenInclude(f => f.Partidos)
                .FirstOrDefaultAsync(l => l.IdActividad == idLiga);

            if (liga == null) return NotFound(new { mensaje = "Liga no encontrada." });

            var partido = liga.Fechas.SelectMany(f => f.Partidos).FirstOrDefault(p => p.IdPartido == idPartido);
            if (partido == null) return NotFound(new { mensaje = "Partido no encontrado." });
            
            if (partido.Estado == "Jugado") return BadRequest(new { mensaje = "Este partido ya tiene resultado cargado." });

            partido.GolesLocal = resultado.GolesLocal;
            partido.GolesVisitante = resultado.GolesVisitante;
            partido.Estado = "Jugado";

            var tablaLocal = liga.Posiciones.FirstOrDefault(p => p.IdEquipo == partido.IdEquipoLocal);
            var tablaVisita = liga.Posiciones.FirstOrDefault(p => p.IdEquipo == partido.IdEquipoVisitante);

            int ptsWin = liga.ReglamentoCompeticion?.PuntosPorVictoria ?? 3;
            int ptsTie = liga.ReglamentoCompeticion?.PuntosPorEmpate ?? 1;
            int ptsLoss = 0;

            if (resultado.GolesLocal > resultado.GolesVisitante) {
                tablaLocal?.ActualizarEstadisticas(ptsWin, resultado.GolesLocal, resultado.GolesVisitante, "Victoria");
                tablaVisita?.ActualizarEstadisticas(ptsLoss, resultado.GolesVisitante, resultado.GolesLocal, "Derrota");
            } else if (resultado.GolesLocal < resultado.GolesVisitante) {
                tablaLocal?.ActualizarEstadisticas(ptsLoss, resultado.GolesLocal, resultado.GolesVisitante, "Derrota");
                tablaVisita?.ActualizarEstadisticas(ptsWin, resultado.GolesVisitante, resultado.GolesLocal, "Victoria");
            } else {
                tablaLocal?.ActualizarEstadisticas(ptsTie, resultado.GolesLocal, resultado.GolesVisitante, "Empate");
                tablaVisita?.ActualizarEstadisticas(ptsTie, resultado.GolesVisitante, resultado.GolesLocal, "Empate");
            }

            liga.OrdenarTabla(); // Reordena tras el resultado
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Resultado guardado y tabla actualizada." });
        }

        
    }
}