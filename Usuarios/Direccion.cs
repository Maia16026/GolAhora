using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GolAhora.Usuarios
{
    public class Direccion
    {
        private string calle;
        private int numero;
        private string localidad;
        private string barrio;
        private int codigoPostal;

        [Key]
        public int IdDireccion { get; set; }

        public string Calle 
        { 
            get { return calle; }
            set { calle = value; } 
        }
        public int Numero 
        { 
            get { return numero; }
            set { numero = value; } 
        }
        public string Localidad 
        { 
            get { return localidad; }
            set { localidad = value; } 
        }
        public string Barrio 
        { 
            get { return barrio; }
            set { barrio = value; } 
        }
        public int CodigoPostal  
        { 
            get { return codigoPostal; }
            set { codigoPostal = value; } 
        }

        [Required]
        public int DniUsuario { get; set; }
        
        [ForeignKey("DniUsuario")]

        [System.Text.Json.Serialization.JsonIgnore] // para que no haya loop con el usuario y que lo ignore, ya que necesito lo de abajo para la bd
        public Usuario? Usuario { get; set; }   
        
        public Direccion() { }

        public Direccion(string calle, int numero, string localidad,string barrio, int codigoPostal)
        {
            this.calle = calle;
            this.numero = numero;
            this.localidad = localidad;
            this.barrio = barrio;
            this.codigoPostal = codigoPostal;   
        }
    }
}
