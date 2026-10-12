using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GolAhora.Reservas;
using Microsoft.AspNetCore.Authorization;

namespace GolAhora.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Administrador")]
    public class TipoCanchasController : ControllerBase
    {
        private readonly GolContext _context;

        public TipoCanchasController(GolContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
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