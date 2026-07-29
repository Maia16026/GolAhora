using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GolAhora.Reservas
{
    public class Cancha
    {
        [Key]
        public int IdCancha { get; set; }

        [Required]
        public int IdTipoCancha { get; set; }

        [ForeignKey("IdTipoCancha")]
        public TipoCancha? TipoDeCancha { get; set; }
        
        public string DiasHabiles { get; set; } 
        public TimeSpan HoraInicio { get; set; }
        public TimeSpan HoraFin { get; set; }
        public int DuracionMaxima { get; set; }
        public bool Disponible { get; set; }

        [JsonIgnore]
        public virtual ICollection<Reserva>? Reservas { get; set; }
    }
}