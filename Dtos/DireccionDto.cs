namespace GolAhora.Dtos{
    public class DireccionDto
    {
        public int Id { get; set; }
        public string Calle { get; set; }
        public int Numero { get; set; }
        public string Localidad { get; set; }
        public string Barrio { get; set; }
        public int CodigoPostal { get; set; } 
    }
}