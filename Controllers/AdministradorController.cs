using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using GolAhora.Usuarios;
using GolAhora.Dtos;
using BCrypt.Net;

namespace GolAhora.Controllers
{
    [Authorize(Roles = "Administrador")] // Seguridad para la clase
    [ApiController] 
    [Route("api/admin")]

    public class AdministradorController : ControllerBase
    {
        private readonly GolContext _context;

        public AdministradorController(GolContext context)
        {
            _context = context;
        }

        [HttpGet("listar-usuarios")]//Listar todos los usuarios (solo para el administradorr)

public async Task<IActionResult> ListarUsuarios()
{
    // 1. Buscamos a los Clientes y les "pegamos" el rol
    var clientes = await _context.Clientes.Include(c => c.direccion_)
        .Select(c => new UsuarioDto 
        {
            Nombre = c.Nombre,
            Apellido = c.Apellido,
            Dni = c.Dni,
            Mail = c.Mail,
            Telefono = c.Telefono,
            Rol = "Cliente",// Lo hardcodeamos en la respuesta
            Direccion_ = c.direccion_ != null ? new DireccionDto 
        {
            Id = c.direccion_.IdDireccion,
            Calle = c.direccion_.Calle,
            Numero = c.direccion_.Numero,
            Localidad = c.direccion_.Localidad,
            Barrio = c.direccion_.Barrio,
            CodigoPostal = c.direccion_.CodigoPostal
        } : null
        })
        .ToListAsync();

    // 2. Buscamos a los Administradores
    var administradores = await _context.Administradores.Include(a => a.direccion_)
        .Select(a => new UsuarioDto 
        {
            Nombre = a.Nombre,
            Apellido = a.Apellido,
            Dni = a.Dni,
            Mail = a.Mail,
            Telefono = a.Telefono,
            Rol = "Administrador", // Lo hardcodeamos en la respuesta
            Direccion_ = a.direccion_ != null ? new DireccionDto 
        {
            Id = a.direccion_.IdDireccion,
            Calle = a.direccion_.Calle,
            Numero = a.direccion_.Numero,
            Localidad = a.direccion_.Localidad,
            Barrio = a.direccion_.Barrio,
            CodigoPostal = a.direccion_.CodigoPostal
        } : null
            
        })
        .ToListAsync();

    // 3. Buscamos a los Profesores
    var profesores = await _context.Profesores.Include(p => p.direccion_)
        .Select(p => new UsuarioDto 
        {
            Nombre = p.Nombre,
            Apellido = p.Apellido,
            Dni = p.Dni,
            Mail = p.Mail,
            Telefono = p.Telefono,
            Rol = "Profesor", // Lo hardcodeamos en la respuesta
            Direccion_ = p.direccion_ != null ? new DireccionDto 
        {
            Id = p.direccion_.IdDireccion,
            Calle = p.direccion_.Calle,
            Numero = p.direccion_.Numero,
            Localidad = p.direccion_.Localidad,
            Barrio = p.direccion_.Barrio,
            CodigoPostal = p.direccion_.CodigoPostal
        } : null
        })
        .ToListAsync();

    var entrenadores = await _context.Entrenadores.Include(e => e.direccion_)
        .Select(e => new UsuarioDto 
        {
            Nombre = e.Nombre,
            Apellido = e.Apellido,
            Dni = e.Dni,
            Mail = e.Mail,
            Telefono = e.Telefono,
            Rol = "Entrenador", // Lo hardcodeamos en la respuesta
            Direccion_ = e.direccion_ != null ? new DireccionDto 
        {
            Id = e.direccion_.IdDireccion,
            Calle = e.direccion_.Calle,
            Numero = e.direccion_.Numero,
            Localidad = e.direccion_.Localidad,
            Barrio = e.direccion_.Barrio,
            CodigoPostal = e.direccion_.CodigoPostal
        } : null
        })
        .ToListAsync();

    // (Hacés lo mismo para Entrenadores si los tenés en otra tabla)

    // 4. Unimos todas las listas en una sola colección gigante
    // El método Concat() de LINQ es ideal para esto
    var todosLosUsuarios = clientes
        .Concat(administradores)
        .Concat(profesores)
        .Concat(entrenadores)
        .ToList();

    // 5. Devolvemos el paquete unificado al Front-end
    return Ok(todosLosUsuarios);
}

[HttpGet("buscar/{dni}")] // (solo para admin)
public async Task<IActionResult> ObtenerUsuario(int dni)
{
    // 1. Buscamos al usuario base incluyendo su dirección
    var usuario = await _context.Usuarios
        .Include(U => U.direccion_)
        .FirstOrDefaultAsync(U => U.Dni == dni);

    if (usuario == null)
    {
        return NotFound(new { mensaje = "Usuario no encontrado..." });
    }

    string rolCalculado = "Cliente"; 
    string especialidad = "";
    int antiguedad = 0;
    int idCertificado = 0;

    // 2. MAGIA: Descubrimos su rol real preguntando de qué clase heredó
    if (usuario is Administrador) rolCalculado = "Administrador";

    else if (usuario is Profesor profe) {
        rolCalculado = "Profesor";
        especialidad = profe.Especialidad;
        antiguedad = profe.Antiguedad;
        idCertificado = profe.IdCertificado??0;
    }
    else if(usuario is Entrenador entrena){ 
        rolCalculado = "Entrenador";
        especialidad = entrena.Especialidad;
        antiguedad = entrena.Antiguedad;
        idCertificado = entrena.IdCertificado??0;
    }


    // 3. Empaquetamos en el DTO (Evitamos filtrar la contraseña, mandamos la dirección y el Rol)
    var usuarioDto = new UsuarioDto
    {
        Nombre = usuario.Nombre,
        Apellido = usuario.Apellido,
        Dni = usuario.Dni,
        Mail = usuario.Mail,
        Telefono = usuario.Telefono,
        Rol = rolCalculado,
    
        // Inyectamos los datos del instructor que el front-end está esperando 
        Especialidad = especialidad,
        Antiguedad = antiguedad,
        IdCertificado = idCertificado,

        // Mapeo de direccion
        Direccion_ = usuario.direccion_ != null ? new DireccionDto
        {
            Id = usuario.direccion_.IdDireccion,
            Calle = usuario.direccion_.Calle,
            Numero = usuario.direccion_.Numero,
            Localidad = usuario.direccion_.Localidad,
            Barrio = usuario.direccion_.Barrio,
            CodigoPostal = usuario.direccion_.CodigoPostal
        } : null
    };

    // 4. Devolvemos la caja correcta
    return Ok(usuarioDto);
}


        // Modificar Usuario
        [HttpPut("modificar-usuario/{dni}")]
        public async Task<IActionResult> ModificarUsuario(int dni, [FromBody] UsuarioDto usuarioEditado)
        {
            if (dni != usuarioEditado.Dni)
            {
                return BadRequest(new { mensaje = "El DNI de la URL no coincide con el del JSON." });
            }

            var usuarioDb = await _context.Usuarios.Include(c => c.direccion_).FirstOrDefaultAsync(c => c.Dni == dni);

            if (usuarioDb == null)
            {
                return NotFound(new { mensaje = "El usuario no existe." });
            }

            usuarioDb.Nombre = usuarioEditado.Nombre;
            usuarioDb.Apellido = usuarioEditado.Apellido;
            usuarioDb.Mail = usuarioEditado.Mail;
            usuarioDb.Telefono = usuarioEditado.Telefono;

            if (usuarioDb.direccion_ == null) 
                {
                    usuarioDb.direccion_ = new Direccion(); // Si no tenía dirección, la instanciamos
                }
                
                usuarioDb.direccion_.Calle = usuarioEditado.Direccion_.Calle;
                usuarioDb.direccion_.Numero = usuarioEditado.Direccion_.Numero;
                usuarioDb.direccion_.Localidad = usuarioEditado.Direccion_.Localidad;
                usuarioDb.direccion_.Barrio = usuarioEditado.Direccion_.Barrio;
                usuarioDb.direccion_.CodigoPostal = usuarioEditado.Direccion_.CodigoPostal;

            try
            {

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error {ex.Message}");
            }

            return Ok(new { mensaje = "Usuario actualizado correctamente" });
        }


        // RF04 - Imprimir datos usuario
        [HttpGet("{dni}/imprimir")]
        public async Task<IActionResult> ImprimirUsuario(int dni)
        {
            Usuario usuario = await _context.Usuarios.Include(u => u.direccion_).FirstOrDefaultAsync(u => u.Dni == dni);

            if (usuario == null)
            {
                return NotFound(new { mensaje = "Usuario no encontrado" });
            }

            string direccionFormateada;

            if (usuario.direccion_ != null)
            {
                direccionFormateada = $"{usuario.direccion_.Calle} {usuario.direccion_.Numero}, {usuario.direccion_.Localidad}";
            }
            else
            {
                direccionFormateada = "Sin dirección";
            }

            var datos = new
            {
                DNI = usuario.Dni,
                NombreCompleto = $"{usuario.Nombre} {usuario.Apellido}",
                Mail = usuario.Mail,
                Telefono = usuario.Telefono,
                Direccion = direccionFormateada,
                FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy HH:mm")
            };

            return Ok(datos);
        }


        [HttpDelete("{dni}/eliminar")]
        public async Task<IActionResult> EliminarUsuario(int dni)
        {
            // Agregamos el Include para traer la dirección
            Usuario usuario = await _context.Usuarios.Include(u => u.direccion_).FirstOrDefaultAsync(u => u.Dni == dni);

            if (usuario == null)
            {
                return NotFound(new { mensaje = "Usuario no encontrado" });
            }

            if (usuario.direccion_ != null)
            {
                _context.Direcciones.Remove(usuario.direccion_);
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Usuario eliminado correctamente" });
        }


// ENDPOINT 1: Solo inserta el Certificado y devuelve el ID
[HttpPost("certificado")]
public async Task<IActionResult> CrearCertificado([FromBody] CertificadoDto dto)
{
    var nuevoCertificado = new Certificado // (Asegurate de que tu clase se llame así en Entity Framework)
    {
        NombreCertificacion = dto.NombreCertificado, 
        EnteEmisor = dto.EnteEmisor,
        FechaEmision = dto.FechaEmision,
        Verificado = dto.Verificado
    };

    _context.Certificados.Add(nuevoCertificado);
    await _context.SaveChangesAsync(); 

    // ¡MAGIA! Entity Framework ya llenó el Id autoincremental al hacer SaveChanges
    return Ok(new { idCertificado = nuevoCertificado.IdCertificado, mensaje = "Certificado generado correctamente." });
}

// ENDPOINT 2: Hace el movimiento de tablas usando el ID del certificado
[HttpPost("{dni}/ascender-instructor")]
public async Task<IActionResult> AscenderInstructor(int dni, [FromBody] AscensoInstructorDto paquete)
{
    // 1. Buscamos al usuario existente en el contexto base
    var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Dni == dni);

    if (usuario == null)
    {
        return NotFound(new { mensaje = "Usuario no encontrado en el sistema." });
    }

    string tipoSolicitado = paquete.TipoInstructor; // "Profesor" o "Entrenador"

    // ==========================================================================
    // CASO 1: El usuario ya posee el rol solicitado (Hacemos un UPDATE tradicional)
    // ==========================================================================
    if ((usuario is Profesor && tipoSolicitado == "Profesor") || 
        (usuario is Entrenador && tipoSolicitado == "Entrenador"))
    {
        if (usuario is Profesor profe)
        {
            profe.Especialidad = paquete.Especialidad;
            profe.Antiguedad = paquete.Antiguedad;
            if (paquete.IdCertificado > 0) profe.IdCertificado = paquete.IdCertificado;
        }
        else if (usuario is Entrenador entrena)
        {
            entrena.Especialidad = paquete.Especialidad;
            entrena.Antiguedad = paquete.Antiguedad;
            if (paquete.IdCertificado > 0) entrena.IdCertificado = paquete.IdCertificado;
        }

        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Datos del instructor actualizados correctamente." });
    }

    // ==========================================================================
    // CASO 2: CAMBIO DE ROL INVERSO 
    // ==========================================================================
    
    // Desacoplamos la entidad del rastreador de EF Core 
    // para que nos deje operar la base de datos por afuera sin lanzar excepciones de conflicto.
    _context.Entry(usuario).State = EntityState.Detached;

    int? certificadoFinal = paquete.IdCertificado > 0 ? paquete.IdCertificado : null;

    if (usuario is Profesor && tipoSolicitado == "Entrenador")
    {
        // 1. Hacemos el DELETE en la tabla de la que se va
        await _context.Database.ExecuteSqlRawAsync("DELETE FROM Profesores WHERE Dni = {0}", dni);
        
        // 2. Hacemos el INSERT en la tabla a la que ingresa
        await _context.Database.ExecuteSqlRawAsync(
            "INSERT INTO Entrenadores (Dni) VALUES ({0})", 
            dni);
        
        await _context.Database.ExecuteSqlRawAsync(
            "UPDATE Instructores SET Especialidad = {1}, Antiguedad = {2}, IdCertificado = {3} WHERE Dni = {0}", 
            dni, paquete.Especialidad, paquete.Antiguedad, certificadoFinal);
    }
    else if (usuario is Entrenador && tipoSolicitado == "Profesor")
    {
        // 1. Hacemos el DELETE de la tabla entrenador
        await _context.Database.ExecuteSqlRawAsync("DELETE FROM Entrenadores WHERE Dni = {0}", dni);
        
        // 2. Hacemos el INSERT en la tabla profesores
        await _context.Database.ExecuteSqlRawAsync(
            "INSERT INTO Profesores (Dni) VALUES ({0})", 
            dni);

        await _context.Database.ExecuteSqlRawAsync(
            "UPDATE Instructores SET Especialidad = {1}, Antiguedad = {2}, IdCertificado = {3} WHERE Dni = {0}", 
            dni, paquete.Especialidad, paquete.Antiguedad, certificadoFinal);
    }

    return Ok(new { mensaje = "El cambio de rol y especialidad se procesó correctamente." });
}
}
}
