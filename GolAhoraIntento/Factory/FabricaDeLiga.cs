using GolAhora.Actividades;

namespace GolAhora.Factory
{
    internal class FabricaDeLiga : FabricaDeActividades
    {
        public override Actividad Instanciar(string nombre)
        {
            return new Liga { NombreActividad = nombre };
        }
    }
}