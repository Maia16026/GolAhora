using System.ComponentModel.DataAnnotations;
using GolAhora.Usuarios;
using System.Text.Json.Serialization;

namespace GolAhora.Reservas
{
    public class TipoCancha
    {
        [Key]
        public int IdTipoCancha { get; set; } // 

        [Required]
        public string Nombre { get; set; } // 

        public string Superficie { get; set; } // 

        public int Capacidad { get; set; } // 

        public double Precio { get; set; } // 

        // Relación inversa para que EF sepa que un tipo tiene muchas canchas
        [JsonIgnore]
        public List<Cancha>? Canchas { get; set; }

    }
}