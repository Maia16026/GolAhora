using GolAhora.Actividades;

namespace GolAhora.Factory
{
    internal class FabricaDeClase : FabricaDeActividades
    {
        public override Actividad Instanciar(string nombre)
        {
            return new Clase { NombreActividad = nombre };
        }
    }
}