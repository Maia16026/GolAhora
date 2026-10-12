namespace GolAhora.Dtos
{
    public class UsuarioDto
{
    public string Nombre { get; set; }
    public string Apellido { get; set; }
    public int Dni { get; set; }
    public string Mail { get; set; }
    public int Telefono { get; set; }

    public string Rol { get; set; } 
    public DireccionDto Direccion_ { get; set; }

    public string Especialidad { get; set; }
    public int Antiguedad { get; set; }
    public int IdCertificado { get; set; }
}
}