using GolAhora.Actividades;
using System;

namespace GolAhora.Factory
{
    public abstract class FabricaDeActividades
    {
        
        public const int CLASE = 1;
        public const int ENTRENAMIENTO = 2;
        public const int LIGA = 3;
        public const int TORNEO = 4;

        
        public static Actividad CrearActividad(int tipoActividad, string nombre)
        {
            FabricaDeActividades fabrica = null;

            switch (tipoActividad)
            {
                case CLASE:
                    fabrica = new FabricaDeClase();
                    break;
                case ENTRENAMIENTO:
                    fabrica = new FabricaDeEntrenamiento();
                    break;
                case LIGA:
                    fabrica = new FabricaDeLiga();
                    break;
                case TORNEO:
                    fabrica = new FabricaDeTorneo();
                    break;
                default:
                    throw new ArgumentException("Tipo de actividad no válido");
            }

            return fabrica.Instanciar(nombre);
        }

        public abstract Actividad Instanciar(string nombre);
    }
}