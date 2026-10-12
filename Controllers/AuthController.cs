using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GolAhora.Usuarios;
using GolAhora.Dtos;
using BCrypt.Net;

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
            // 1. Buscamos PRIMERO en la tabla de Administradores
            var admin = await _context.Administradores.FirstOrDefaultAsync(a => a.Mail == login.Mail);

            if (admin != null && BCrypt.Net.BCrypt.Verify(login.Contrasena, admin.Contrasena))
            {
                string token = GenerarToken(admin.Dni.ToString(), "Administrador");
                return Ok(new
                {
                    token = token,
                    rol = "Administrador",
                    nombre = admin.Nombre,
                    apellido = admin.Apellido
                });
            }
            
            // 2. Si no es admin, recién ahí buscamos en la tabla de Clientes
            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Mail == login.Mail);

            if (cliente != null && BCrypt.Net.BCrypt.Verify(login.Contrasena, cliente.Contrasena))
            {
                string token = GenerarToken(cliente.Dni.ToString(), "Cliente");
                return Ok(new { 
                    token = token, 
                    rol = "Cliente", 
                    nombre = cliente.Nombre,
                    apellido = cliente.Apellido
                });
            }

            return Unauthorized(new { mensaje = "Credenciales incorrectas." });
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

