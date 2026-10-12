using GolAhora.Actividades;

namespace GolAhora.Factory
{
    internal class FabricaDeEntrenamiento : FabricaDeActividades
    {
        public override Actividad Instanciar(string nombre)
        {
            return new Entrenamiento { NombreActividad = nombre };
        }
    }
}