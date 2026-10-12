using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using GolAhora.Usuarios; 

namespace GolAhora.Actividades
{
    public class Jugador
    {
        [Key]
        public int IdJugador { get; set; }

        [Required]
        public int IdEquipo { get; set; }
        
        [JsonIgnore] 
        [ForeignKey("IdEquipo")]
        [InverseProperty("Jugadores")] 
        public Equipo EquipoAsociado { get; set; }

        // SI ES USUARIO REGISTRADO
        public int? DniUsuario { get; set; } 
        
        [ForeignKey("DniUsuario")]
        public Usuario UsuarioAsociado { get; set; }


        // SI ES INVITADO

        public string NombreInvitado { get; set; } = string.Empty;
        public int? DniInvitado { get; set; } 

        public int? Dorsal { get; set; } 
    }
}