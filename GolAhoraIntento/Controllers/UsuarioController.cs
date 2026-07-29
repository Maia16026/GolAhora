using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using GolAhora.Usuarios;

namespace GolAhora.Controllers
{
    [ApiController] // Le dice a ASP.NEt "esto es un controlador de API" (activa validaciones automaticas) y recibe json
    [Route("api/[controller]")] // define el URL del endpoint remplaza controller por el nombre de la clase"api/usuario" 

    public class UsuarioController : ControllerBase // creo una clase que hereda controllerBase, contoller de api, tiene funciones http listas, recibir y devolver datos
    {
        private readonly GolContext _context;

        public UsuarioController(GolContext context) // Consturctor que recibe Clase golContext (inyecta bd)
        {
            _context = context;
        }

        [HttpPost("registrar")] // Responde solicitudes Post "/api/usuario"

        // IactionResult: devuelve tipos de respuestas (200 ok, 400 bad request, 404, etc...)
        // FromBody: avisa a .net que el dato viene del body del request en forma de json

        public async Task<IActionResult> CrearUsuario([FromBody] Usuario usuario) // usuario se arma automaticamente desde el json
        {
            // Busco si existe usuario con ese dni
            Usuario usuarioExiste = await _context.Usuarios.FindAsync(usuario.Dni);
            Usuario mailExiste = await _context.Usuarios.FirstOrDefaultAsync(U => U.Mail == usuario.Mail);


            if (usuarioExiste != null)
            {
                return Conflict(new { mensaje = "Ya existe un usuario con ese DNI..." });
            }


            if (mailExiste != null)
            {
                return Conflict(new { mensaje = "Ya existe usuario con ese mail" });
            }


            Cliente nuevoCliente = new Cliente
            {
                Dni = usuario.Dni,
                Nombre = usuario.Nombre,
                Apellido = usuario.Apellido,
                Telefono = usuario.Telefono,
                Mail = usuario.Mail,
                Contrasena = usuario.Contrasena
            };

            Direccion nuevaDireccion = new Direccion
            {
                Calle = usuario.direccion_.Calle,
                Numero = usuario.direccion_.Numero,
                Localidad = usuario.direccion_.Localidad,
                Barrio = usuario.direccion_.Barrio,
                CodigoPostal = usuario.direccion_.CodigoPostal,
                DniUsuario = usuario.Dni

            };

            _context.Clientes.Add(nuevoCliente);
            _context.Direcciones.Add(nuevaDireccion);
            await _context.SaveChangesAsync(); 
            return Ok(usuario);
        }



        // GET: /api/usuario/mi-perfil
        [Authorize] // Exigimos que esté logueado (sin importar si es Cliente o Admin)
        [HttpGet("mi-perfil")]
        public async Task<IActionResult> ObtenerMiPerfil()
        {
            // MAGIA DE SEGURIDAD: Leemos el DNI directamente del Token desencriptado
            // El usuario NO manda el DNI en la URL, el servidor ya sabe quién es.
            var dniClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(dniClaim))
            {
                return Unauthorized(new { mensaje = "No se pudo identificar al usuario." });
            }

            int miDni = int.Parse(dniClaim);

            Usuario miUsuario = await _context.Usuarios.Include(U => U.direccion_).FirstOrDefaultAsync(U => U.Dni == miDni);
            
            if (miUsuario == null) return NotFound(new { mensaje = "Tus datos no fueron encontrados." });
            
            return Ok(miUsuario);
        }


        // PUT: /api/usuario/mi-perfil
        [Authorize] // Exigimos que esté logueado
        [HttpPut("mi-perfil")]
        public async Task<IActionResult> ModificarMiPerfil([FromBody] Usuario usuarioModificado)
        {
            // Sacamos el DNI directamente del Token desencriptado
            var dniClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(dniClaim))
            {
                return Unauthorized(new { mensaje = "No se pudo identificar al usuario." });
            }

            int miDni = int.Parse(dniClaim);

            // Buscamos al usuario en la base de datos usando el DNI del Token
            Usuario usuarioExiste = await _context.Usuarios.Include(u => u.direccion_).FirstOrDefaultAsync(u => u.Dni == miDni);

            if (usuarioExiste == null)
            {
                return NotFound(new { mensaje = "El usuario no existe en el sistema." });
            }

            // Validamos si cambió el mail, que el nuevo no esté repetido por otro usuario
            if (usuarioExiste.Mail != usuarioModificado.Mail)
            {
                Usuario mailExiste = await _context.Usuarios.FirstOrDefaultAsync(u => u.Mail == usuarioModificado.Mail && u.Dni != miDni);
                    
                if (mailExiste != null)
                {
                    return Conflict(new { mensaje = "El nuevo email ya está en uso por otro usuario." });
                }
            }

            // Solo reasignamos los datos personales permitidos.
            // Dejamos completamente afuera el Dni, la Contrasena y cualquier propiedad de permisos.
            usuarioExiste.Nombre = usuarioModificado.Nombre;
            usuarioExiste.Apellido = usuarioModificado.Apellido;
            usuarioExiste.Telefono = usuarioModificado.Telefono;
            usuarioExiste.Mail = usuarioModificado.Mail;

            // Si mandan datos de dirección y el usuario ya tiene una asignada, la actualizamos
            if (usuarioModificado.direccion_ != null && usuarioExiste.direccion_ != null)
            {
                usuarioExiste.direccion_.Barrio = usuarioModificado.direccion_.Barrio;
                usuarioExiste.direccion_.Calle = usuarioModificado.direccion_.Calle;
                usuarioExiste.direccion_.CodigoPostal = usuarioModificado.direccion_.CodigoPostal;
                usuarioExiste.direccion_.Localidad = usuarioModificado.direccion_.Localidad;
                usuarioExiste.direccion_.Numero = usuarioModificado.direccion_.Numero;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al actualizar perfil: {ex.Message}");
                return StatusCode(500, new { mensaje = "Hubo un error interno al guardar los cambios." });
            }

            // Devolvemos el usuario actualizado (podés elegir devolver un mensaje de éxito también)
            return Ok(usuarioExiste);
            }
    }
}