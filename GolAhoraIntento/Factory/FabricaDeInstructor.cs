using System;
using GolAhora.Usuarios;

namespace GolAhora.Factory
{
    internal class FabricaDeInstructor : FabricaDeUsuarios
    {
        private readonly int _subTipo;
        private readonly string? _especialidad;
        private readonly int _antiguedad;

        public FabricaDeInstructor(int subTipo, string? especialidad, int antiguedad)
        {
            this._subTipo = subTipo;
            this._especialidad = especialidad;
            this._antiguedad = antiguedad;
        }

        
        public override Usuario crearUsuario()
        {
            switch (_subTipo)
            {
                case profesor:
                    return new Profesor
                    {
                        Especialidad = _especialidad,
                        Antiguedad = _antiguedad
                        // El certificado nace null listo para que el administrador lo gestione después
                    };

                case entrenador:
                    return new Entrenador
                    {
                        Especialidad = _especialidad,
                        Antiguedad = _antiguedad
                    };

                default:
                    throw new ArgumentException("Subtipo de instructor no soportado");
            }
        }
    }
}