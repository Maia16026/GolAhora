using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GolAhora.Reservas;

namespace GolAhora.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TipoCanchasController : ControllerBase
    {
        private readonly GolContext _context;

        public TipoCanchasController(GolContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTipos()
        {
            var tipos = await _context.Set<TipoCancha>().ToListAsync();
            return Ok(tipos);
        }

        [HttpPost]
        public async Task<IActionResult> PostTipo([FromBody] TipoCancha nuevoTipo)
        {
            _context.Set<TipoCancha>().Add(nuevoTipo);
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Tipo de cancha creado", id = nuevoTipo.IdTipoCancha });
        }
    }
}