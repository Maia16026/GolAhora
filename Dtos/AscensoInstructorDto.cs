namespace GolAhora.Dtos
{
        public class AscensoInstructorDto
    {
        public int IdCertificado { get; set; } // Ahora solo recibimos el ID que ya se generó
        public string Especialidad { get; set; }
        public int Antiguedad { get; set; }
        public string TipoInstructor { get; set; } 
    }
}