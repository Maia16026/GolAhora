using GolAhora.Actividades;

namespace GolAhora.Factory
{
    internal class FabricaDeTorneo : FabricaDeActividades
    {
        public override Actividad Instanciar(string nombre)
        {
            return new Torneo { NombreActividad = nombre };
        }
    }
}