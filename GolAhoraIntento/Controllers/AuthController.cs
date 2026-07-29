using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GolAhora.Usuarios;
using GolAhora.Dtos;

namespace GolAhora.Controllers
{
    [ApiController]
    [Route("api/auth")]

    public class AuthController : ControllerBase
    {
        private readonly GolContext _context;
        private readonly IConfiguration _config;

        public AuthController(GolContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto login) //Entra un mail y contraseña en LoginDto
        {
            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Mail == login.Mail && c.Contrasena == login.Contrasena);

            if(cliente != null)
            {
                string token = GenerarToken(cliente.Dni.ToString(), "Cliente");
                return Ok(new { 
                    token = token, 
                    rol = "Cliente", // O el nombre de la variable donde guardes el rol del usuario ("admin"/"profe")
                    nombre = cliente.Nombre,
                    apellido = cliente.Apellido
                });
            }

            var admin = await _context.Administradores.FirstOrDefaultAsync(a => a.Mail == login.Mail && a.Contrasena == login.Contrasena);

            if(admin != null)
            {
                string token = GenerarToken(admin.Dni.ToString(), "Administrador");
                return Ok(new { 
                    token = token, 
                    rol = "Administrador", // O el nombre de la variable donde guardes el rol del usuario ("admin"/"profe")
                    nombre = admin.Nombre,
                    apellido = admin.Apellido
                    });
            }

            return Unauthorized(new{mensaje = "Credenciales incorrectas."});
        }

        private string GenerarToken(string dni, string rol)
        {
            // Traemos la clave secreta del appsettings.json
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Armamos el contenido del token (DNI y Rol)
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, dni),
                new Claim(ClaimTypes.Role, rol)
            };

            // Creamos el Token con una fecha de vencimiento (ej. 2 horas)
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"], // probando
                audience: _config["Jwt:Audience"], // probando
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}

